import supabase from '../utils/supabaseClient.js';

export const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, disease, sort = 'created_at', start, end } = req.query;
    
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('reports')
      .select('*', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order(sort, { ascending: false })
      .range(from, to);

    if (disease) {
      query = query.eq('disease_type', disease);
    }

    if (start) {
      query = query.gte('created_at', start);
    }

    if (end) {
      query = query.lte('created_at', end);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    res.status(200).json({
      data,
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit),
    });

  } catch (error) {
    console.error('Get Reports Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select();

    if (error) {
      throw error;
    }

    if (data.length === 0) {
        return res.status(404).json({ error: 'Report not found or not authorized' });
    }

    res.status(200).json({ message: 'Report deleted successfully', data });

  } catch (error) {
    console.error('Delete Report Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    let { data, error } = await supabase
      .from('reports')
      .update({ notes })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select();

    if (error) throw error;

    if (data.length === 0) {
      const result = await supabase
        .from('uploaded_reports')
        .update({ notes })
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();
      
      data = result.data;
      error = result.error;
      
      if (error) throw error;
    }

    if (data.length === 0) {
      return res.status(404).json({ error: 'Report not found or not authorized' });
    }

    res.status(200).json({ message: 'Report updated successfully', data: data[0] });

  } catch (error) {
    console.error('Update Report Error:', error);
    res.status(500).json({ error: error.message });
  }
};

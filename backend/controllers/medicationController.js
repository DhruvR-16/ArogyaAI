import supabase from '../utils/supabaseClient.js';

export const getMedications = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error('Get Medications Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const addMedication = async (req, res) => {
  try {
    const { name, dosage, frequency, time } = req.body;

    const { data, error } = await supabase
      .from('medications')
      .insert([
        {
          user_id: req.user.id,
          name,
          dosage,
          frequency,
          time
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Add Medication Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, dosage, frequency, time } = req.body;

    const { data, error } = await supabase
      .from('medications')
      .update({
        name,
        dosage,
        frequency,
        time,
        updated_at: new Date()
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
        return res.status(404).json({ error: 'Medication not found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Update Medication Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (error) {
    console.error('Delete Medication Error:', error);
    res.status(500).json({ error: error.message });
  }
};

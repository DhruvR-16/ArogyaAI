import supabase from '../utils/supabaseClient.js';
import pool from '../db.js';

export const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { 
      throw error;
    }
    res.status(200).json(data || {});

  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { age, gender, blood_group, allergies, weight, height } = req.body;


    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    let result;

    if (existingProfile) {
      result = await supabase
        .from('profiles')
        .update({
          age,
          gender,
          blood_group,
          allergies,
          weight,
          height,
          updated_at: new Date()
        })
        .eq('user_id', req.user.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('profiles')
        .insert([
          {
            user_id: req.user.id,
            age,
            gender,
            blood_group,
            allergies,
            weight,
            height
          }
        ])
        .select()
        .single();
    }

    if (result.error) throw result.error;

    res.status(200).json({ message: 'Profile updated successfully', data: result.data });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {

    const { action } = req.query; 

    if (action === 'delete_account') {

       await pool.query('DELETE FROM users WHERE id = $1', [req.user.id]);
       return res.status(200).json({ message: 'Account deleted successfully' });
    } else {

       const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', req.user.id);

       if (error) throw error;
       return res.status(200).json({ message: 'Medical profile cleared successfully' });
    }

  } catch (error) {
    console.error('Delete Profile Error:', error);
    res.status(500).json({ error: error.message });
  }
};

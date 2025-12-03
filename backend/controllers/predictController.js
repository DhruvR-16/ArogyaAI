import axios from 'axios';
import supabase from '../utils/supabaseClient.js';

export const predictDisease = async (req, res) => {
  try {
    const { disease } = req.query;
    const inputData = req.body;

    if (!disease || !['diabetes', 'heart', 'kidney'].includes(disease)) {
      return res.status(400).json({ error: 'Invalid or missing disease type. Must be diabetes, heart, or kidney.' });
    }

    const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:8000';
    
    const mlResponse = await axios.post(`${mlServiceUrl}/predict/${disease}`, inputData);
    
    const { prediction, probability, risk_category } = mlResponse.data;


    const { data: savedReport, error: dbError } = await supabase
      .from('reports')
      .insert([
        {
          user_id: req.user.id,
          disease_type: disease,
          input_values: inputData,
          prediction,
          probability,
          risk_category,
        },
      ])
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    res.status(200).json(savedReport);

  } catch (error) {
    console.error('Prediction Error:', error);
    if (error.response) {
        return res.status(error.response.status).json({ error: 'ML Service Error', details: error.response.data });
    }
    res.status(500).json({ error: error.message });
  }
};

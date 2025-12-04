import axios from 'axios';
import supabase from '../utils/supabaseClient.js';

export const predictDisease = async (req, res) => {
  try {
    const { disease } = req.query;
    const inputData = req.body;


    if (!disease || !['diabetes', 'heart', 'kidney'].includes(disease)) {
      return res.status(400).json({ error: 'Invalid or missing disease type. Must be diabetes, heart, or kidney.' });
    }


    const mlServiceUrl = process.env.ML_SERVICE_URL;
    if (!mlServiceUrl) {
      console.error('CRITICAL: ML_SERVICE_URL is not defined in environment variables.');
      return res.status(500).json({ error: 'Server Configuration Error: ML Service URL missing.' });
    }


    console.log(`Calling ML Service at: ${mlServiceUrl}/predict/${disease}`);
    let mlResponse;
    try {
      mlResponse = await axios.post(`${mlServiceUrl}/predict/${disease}`, inputData);
    } catch (mlError) {
      console.error('ML Service Connection Error:', mlError.message);
      if (mlError.code === 'ECONNREFUSED') {
        return res.status(503).json({ error: 'ML Service is unavailable (Connection Refused). Please check if it is running.' });
      }
      if (mlError.response) {
        return res.status(mlError.response.status).json({ error: 'ML Service Error', details: mlError.response.data });
      }
      throw mlError; 
    }
    
    const { prediction, probability, risk_category } = mlResponse.data;

    console.log('Saving prediction to Supabase...');
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
      console.error('Supabase Insert Error:', dbError);
      return res.status(500).json({ error: 'Database Error: Failed to save report.', details: dbError.message });
    }

    console.log('Prediction saved successfully:', savedReport.id);
    res.status(200).json(savedReport);

  } catch (error) {
    console.error('Unhandled Prediction Error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

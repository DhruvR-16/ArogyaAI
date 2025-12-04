import supabase from '../utils/supabaseClient.js';

export const uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    const filePath = `${req.user.id}/${fileName}`;

    console.log('File received:', file.originalname, file.mimetype);

    const { data: storageData, error: storageError } = await supabase.storage
      .from('reports')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (storageError) {
      console.error('Supabase Storage Error:', storageError);
      throw storageError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('reports')
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;
    console.log('File uploaded to storage, URL:', fileUrl);

    const { data: dbData, error: dbError } = await supabase
      .from('uploaded_reports')
      .insert([
        {
          user_id: req.user.id,
          file_url: fileUrl,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase DB Insert Error:', dbError);
      throw dbError;
    }

    res.status(201).json({
      message: 'File uploaded successfully',
      url: fileUrl,
      record: dbData,
    });
  } catch (error) {
    console.error('Upload Controller Error:', error);
    res.status(500).json({ error: error.message, details: error });
  }
};

export const getUploadedReports = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('uploaded_reports')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Get Uploaded Reports Error:', error);
    res.status(500).json({ error: error.message });
  }
};

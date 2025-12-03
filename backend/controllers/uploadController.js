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

    const { data: storageData, error: storageError } = await supabase.storage
      .from('reports')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (storageError) {
      throw storageError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('reports')
      .getPublicUrl(filePath);

    const fileUrl = publicUrlData.publicUrl;

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
      throw dbError;
    }

    res.status(201).json({
      message: 'File uploaded successfully',
      url: fileUrl,
      record: dbData,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: error.message });
  }
};

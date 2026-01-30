import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('excel_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const filesWithUrls = await Promise.all(
      data.map(async (file) => {
        const { data: urlData } = await supabase
          .storage
          .from('excel-files')
          .createSignedUrl(file.file_path, 3600); // 1 цаг хүчинтэй

        return {
          ...file,
          downloadUrl: urlData?.signedUrl
        };
      })
    );

    return NextResponse.json({ files: filesWithUrls });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Файлын жагсаалт авахад алдаа гарлаа' },
      { status: 500 }
    );
  }
}
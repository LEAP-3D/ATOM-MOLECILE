export const dynamic = 'force-dynamic'; // Build үед энэ хуудсыг статик гэж тооцохгүй байхыг зааж өгнө
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0 || files.length > 3) {
      return NextResponse.json(
        { error: '1-3 файл upload хийх боломжтой' },
        { status: 400 }
      );
    }
    const uploadedFiles = [];

    for (const file of files) {
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];

      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `${file.name} нь Excel файл биш байна` },
          { status: 400 }
        );
      }

      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${file.name}`;
      const filePath = `uploads/${uniqueFileName}`;

      const fileBuffer = await file.arrayBuffer();
      const { error: storageError } = await supabase
        .storage
        .from('excel-files')
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: false
        });

      if (storageError) {
        console.error('Storage error:', storageError);
        return NextResponse.json(
          { error: `Файл хадгалахад алдаа гарлаа: ${storageError.message}` },
          { status: 500 }
        );
      }

      const { data: dbData, error: dbError } = await supabase
        .from('excel_files')
        .insert({
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        return NextResponse.json(
          { error: `Database-д хадгалахад алдаа гарлаа: ${dbError.message}` },
          { status: 500 }
        );
      }

      uploadedFiles.push({
        id: dbData.id,
        fileName: file.name,
        filePath: filePath,
        fileSize: file.size
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} файл амжилттай хадгалагдлаа`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Файл upload хийхэд алдаа гарлаа' },
      { status: 500 }
    );
  }
}
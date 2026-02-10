// app/api/routes/generate-chart/utils/create-prompt.ts

export function createChartPrompt(query: string, dataContext: string): string {
  return `
Та өгөгдлийн шинжилгээ болон chart санал болгох AI мэргэжилтэн мөн.

Хэрэглэгчийн хүсэлт: "${query}"

Боломжтой өгөгдөл:
${dataContext}

Даалгавар:
1. Хэрэглэгчийн хүсэлтийг сайтар ойлгох
2. Өгөгдлийн бүтэц, төрлийг шинжлэх
3. Хамгийн тохиромжтой chart төрлийг сонгох
4. Баганы нэрсийг яг дарааллаар нь ашиглах (өөрчлөхгүй)
5. Зөвхөн JSON хариу өгөх

Chart төрлүүд:
- bar: Категори харьцуулах, рейтинг харах
- line: Цаг хугацааны хандлага, өөрчлөлт
- pie: Эзлэх хувь, бүрдэл хэсэг
- area: Нийлбэр өсөлт, accumulated data
- scatter: Хоёр хувьсагчийн хамаарал

JSON Format (шууд JSON, extra text-гүй):
{
  "chartType": "bar",
  "xAxis": "exact_column_name",
  "yAxis": "exact_column_name", 
  "title": "Монгол хэл дээрх товч гарчиг",
  "description": "Энэхүү chart-ийн тайлбар",
  "fileIndex": 0
}

Онцлог анхаарах зүйл:
- xAxis болон yAxis нь заавал файлын баганы нэртэй яг таарах ёстой
- Хэрэглэгчийн хүсэлтэд нийцсэн хамгийн тохиромжтой chart сонгох
- Монгол хэл дээр тайлбарыг бичих
`;
}
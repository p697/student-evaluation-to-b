import XLSX from 'xlsx';

function exportExcel(data, fileName = '数据.xlsx') {

  const jsonWorkSheet = XLSX.utils.json_to_sheet(data, { skipHeader: true });

  const workBook = {
    SheetNames: ['sheet1'],
    Sheets: {
      'sheet1': jsonWorkSheet,
    }
  };

  // 导出 Excel
  XLSX.writeFile(workBook, fileName);
}

export {
  exportExcel,
}

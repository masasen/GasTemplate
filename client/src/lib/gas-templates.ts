export interface GasTemplate {
  id: string;
  name: string;
  type: 'estimate' | 'order' | 'invoice';
  description: string;
  code: string;
  instructions: string[];
}

export const defaultTemplates: GasTemplate[] = [
  {
    id: 'simple-estimate',
    name: 'シンプル見積書',
    type: 'estimate',
    description: '必要最小限の項目で構成された、使いやすい見積書テンプレート',
    code: `
function createEstimate() {
  // スプレッドシートの設定
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = spreadsheet.getSheetByName('設定') || spreadsheet.insertSheet('設定');
  const itemsSheet = spreadsheet.getSheetByName('商品明細') || spreadsheet.insertSheet('商品明細');
  const outputSheet = spreadsheet.getSheetByName('出力') || spreadsheet.insertSheet('出力');
  
  // 会社情報の取得
  const companyInfo = {
    name: configSheet.getRange('B2').getValue() || '{{COMPANY_NAME}}',
    address: configSheet.getRange('B3').getValue() || '{{COMPANY_ADDRESS}}',
    phone: configSheet.getRange('B4').getValue() || '{{COMPANY_PHONE}}',
    email: configSheet.getRange('B5').getValue() || '{{COMPANY_EMAIL}}'
  };
  
  // 顧客情報の取得
  const customerInfo = {
    name: configSheet.getRange('B7').getValue() || '{{CUSTOMER_NAME}}',
    address: configSheet.getRange('B8').getValue() || '{{CUSTOMER_ADDRESS}}',
    phone: configSheet.getRange('B9').getValue() || '{{CUSTOMER_PHONE}}',
    email: configSheet.getRange('B10').getValue() || '{{CUSTOMER_EMAIL}}'
  };
  
  // 商品明細の取得
  const itemsData = itemsSheet.getRange('A2:E100').getValues();
  const items = itemsData.filter(row => row[0] !== '').map(row => ({
    name: row[0],
    description: row[1],
    quantity: row[2],
    unitPrice: row[3],
    total: row[4]
  }));
  
  // 見積書の生成
  generateEstimateDocument(outputSheet, companyInfo, customerInfo, items);
}

function generateEstimateDocument(sheet, company, customer, items) {
  sheet.clear();
  
  // ヘッダー
  sheet.getRange('A1').setValue('見積書').setFontSize(24).setFontWeight('bold');
  sheet.getRange('A3').setValue('見積日: ' + new Date().toLocaleDateString('ja-JP'));
  
  // 会社情報
  sheet.getRange('A5').setValue('発行者情報:').setFontWeight('bold');
  sheet.getRange('A6').setValue(company.name);
  sheet.getRange('A7').setValue(company.address);
  sheet.getRange('A8').setValue('TEL: ' + company.phone);
  sheet.getRange('A9').setValue('Email: ' + company.email);
  
  // 顧客情報
  sheet.getRange('E5').setValue('宛先:').setFontWeight('bold');
  sheet.getRange('E6').setValue(customer.name + ' 様');
  sheet.getRange('E7').setValue(customer.address);
  
  // 明細ヘッダー
  let currentRow = 12;
  sheet.getRange(currentRow, 1, 1, 5).setValues([['商品名', '説明', '数量', '単価', '金額']]);
  sheet.getRange(currentRow, 1, 1, 5).setFontWeight('bold').setBackground('#f0f0f0');
  
  // 明細データ
  currentRow++;
  let total = 0;
  items.forEach(item => {
    sheet.getRange(currentRow, 1, 1, 5).setValues([[
      item.name,
      item.description,
      item.quantity,
      '¥' + item.unitPrice.toLocaleString(),
      '¥' + item.total.toLocaleString()
    ]]);
    total += item.total;
    currentRow++;
  });
  
  // 合計
  currentRow++;
  sheet.getRange(currentRow, 4).setValue('合計:').setFontWeight('bold');
  sheet.getRange(currentRow, 5).setValue('¥' + total.toLocaleString()).setFontWeight('bold');
  
  // スタイルの調整
  sheet.autoResizeColumns(1, 5);
}

// 設定シートの初期化
function initializeConfigSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = spreadsheet.getSheetByName('設定') || spreadsheet.insertSheet('設定');
  
  configSheet.getRange('A1').setValue('会社情報').setFontWeight('bold');
  configSheet.getRange('A2:B5').setValues([
    ['会社名', '{{COMPANY_NAME}}'],
    ['住所', '{{COMPANY_ADDRESS}}'],
    ['電話番号', '{{COMPANY_PHONE}}'],
    ['メールアドレス', '{{COMPANY_EMAIL}}']
  ]);
  
  configSheet.getRange('A6').setValue('顧客情報').setFontWeight('bold');
  configSheet.getRange('A7:B10').setValues([
    ['顧客名', '{{CUSTOMER_NAME}}'],
    ['住所', '{{CUSTOMER_ADDRESS}}'],
    ['電話番号', '{{CUSTOMER_PHONE}}'],
    ['メールアドレス', '{{CUSTOMER_EMAIL}}']
  ]);
}

// 商品明細シートの初期化
function initializeItemsSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const itemsSheet = spreadsheet.getSheetByName('商品明細') || spreadsheet.insertSheet('商品明細');
  
  itemsSheet.getRange('A1:E1').setValues([['商品名', '説明', '数量', '単価', '金額']]);
  itemsSheet.getRange('A1:E1').setFontWeight('bold').setBackground('#f0f0f0');
  
  // サンプルデータ
  {{ITEMS_DATA}}
}
`,
    instructions: [
      'Google ドライブで新しいGoogle スプレッドシートを作成します',
      'スプレッドシートの「拡張機能」メニューから「Apps Script」を選択します',
      '表示されたエディタに生成されたコードを貼り付けます',
      'コード内の{{COMPANY_NAME}}などのプレースホルダーを実際の値に置き換えます',
      '「initializeConfigSheet」と「initializeItemsSheet」関数を実行してシートを初期化します',
      '「設定」シートに会社情報と顧客情報を入力します',
      '「商品明細」シートに商品・サービス情報を入力します',
      '「createEstimate」関数を実行して見積書を生成します'
    ]
  },
  {
    id: 'detailed-order',
    name: '詳細注文書',
    type: 'order',
    description: '商品詳細、数量、価格を詳細に記載できる注文書テンプレート',
    code: `
function createDetailedOrder() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = spreadsheet.getSheetByName('設定') || spreadsheet.insertSheet('設定');
  const itemsSheet = spreadsheet.getSheetByName('商品明細') || spreadsheet.insertSheet('商品明細');
  const outputSheet = spreadsheet.getSheetByName('出力') || spreadsheet.insertSheet('出力');
  
  // 会社情報の取得
  const companyInfo = {
    name: configSheet.getRange('B2').getValue() || '{{COMPANY_NAME}}',
    address: configSheet.getRange('B3').getValue() || '{{COMPANY_ADDRESS}}',
    phone: configSheet.getRange('B4').getValue() || '{{COMPANY_PHONE}}',
    email: configSheet.getRange('B5').getValue() || '{{COMPANY_EMAIL}}'
  };
  
  // 顧客情報の取得
  const customerInfo = {
    name: configSheet.getRange('B7').getValue() || '{{CUSTOMER_NAME}}',
    address: configSheet.getRange('B8').getValue() || '{{CUSTOMER_ADDRESS}}',
    phone: configSheet.getRange('B9').getValue() || '{{CUSTOMER_PHONE}}',
    email: configSheet.getRange('B10').getValue() || '{{CUSTOMER_EMAIL}}'
  };
  
  // 商品明細の取得
  const itemsData = itemsSheet.getRange('A2:F100').getValues();
  const items = itemsData.filter(row => row[0] !== '').map(row => ({
    name: row[0],
    description: row[1],
    quantity: row[2],
    unitPrice: row[3],
    total: row[4],
    category: row[5] || '一般'
  }));
  
  generateDetailedOrderDocument(outputSheet, companyInfo, customerInfo, items);
}

function generateDetailedOrderDocument(sheet, company, customer, items) {
  sheet.clear();
  
  // ヘッダー
  sheet.getRange('A1').setValue('注文書').setFontSize(24).setFontWeight('bold');
  sheet.getRange('A1:F1').merge().setHorizontalAlignment('center');
  
  const orderNumber = 'ORD-' + Utilities.formatDate(new Date(), 'JST', 'yyyyMMdd') + '-001';
  sheet.getRange('A3').setValue('注文番号: ' + orderNumber).setFontWeight('bold');
  sheet.getRange('E3').setValue('注文日: ' + new Date().toLocaleDateString('ja-JP')).setFontWeight('bold');
  
  // 会社情報
  sheet.getRange('A5').setValue('発注者情報:').setFontWeight('bold');
  sheet.getRange('A6').setValue(company.name);
  sheet.getRange('A7').setValue(company.address);
  sheet.getRange('A8').setValue('TEL: ' + company.phone);
  sheet.getRange('A9').setValue('Email: ' + company.email);
  
  // 受注者情報
  sheet.getRange('D5').setValue('受注者:').setFontWeight('bold');
  sheet.getRange('D6').setValue(customer.name + ' 様');
  sheet.getRange('D7').setValue(customer.address);
  
  // 明細ヘッダー
  let currentRow = 12;
  sheet.getRange(currentRow, 1, 1, 6).setValues([['商品名', '説明', 'カテゴリ', '数量', '単価', '金額']]);
  sheet.getRange(currentRow, 1, 1, 6).setFontWeight('bold').setBackground('#e8f0fe');
  
  // 明細データ
  currentRow++;
  let total = 0;
  items.forEach(item => {
    sheet.getRange(currentRow, 1, 1, 6).setValues([[
      item.name,
      item.description,
      item.category,
      item.quantity,
      '¥' + item.unitPrice.toLocaleString(),
      '¥' + item.total.toLocaleString()
    ]]);
    total += item.total;
    currentRow++;
  });
  
  // 合計
  currentRow += 2;
  sheet.getRange(currentRow, 5).setValue('合計金額:').setFontWeight('bold');
  sheet.getRange(currentRow, 6).setValue('¥' + total.toLocaleString()).setFontWeight('bold');
  
  // 備考欄
  currentRow += 3;
  sheet.getRange(currentRow, 1).setValue('備考:').setFontWeight('bold');
  sheet.getRange(currentRow + 1, 1, 3, 6).setBorder(true, true, true, true, true, true);
  
  // スタイルの調整
  sheet.autoResizeColumns(1, 6);
}

// 初期化関数
function initializeDetailedOrderSheets() {
  initializeConfigSheet();
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const itemsSheet = spreadsheet.getSheetByName('商品明細') || spreadsheet.insertSheet('商品明細');
  
  itemsSheet.getRange('A1:F1').setValues([['商品名', '説明', '数量', '単価', '金額', 'カテゴリ']]);
  itemsSheet.getRange('A1:F1').setFontWeight('bold').setBackground('#e8f0fe');
  
  {{ITEMS_DATA}}
}
`,
    instructions: [
      'Google ドライブで新しいGoogle スプレッドシートを作成します',
      'スプレッドシートの「拡張機能」メニューから「Apps Script」を選択します',
      '表示されたエディタに生成されたコードを貼り付けます',
      'コード内の{{COMPANY_NAME}}などのプレースホルダーを実際の値に置き換えます',
      '「initializeDetailedOrderSheets」関数を実行してシートを初期化します',
      '「設定」シートに会社情報と顧客情報を入力します',
      '「商品明細」シートに商品・サービス情報とカテゴリを入力します',
      '「createDetailedOrder」関数を実行して詳細注文書を生成します'
    ]
  },
  {
    id: 'monthly-invoice',
    name: '月次請求書',
    type: 'invoice',
    description: '月次での請求に特化した、自動計算機能付きの請求書テンプレート',
    code: `
function createMonthlyInvoice() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const configSheet = spreadsheet.getSheetByName('設定') || spreadsheet.insertSheet('設定');
  const itemsSheet = spreadsheet.getSheetByName('商品明細') || spreadsheet.insertSheet('商品明細');
  const outputSheet = spreadsheet.getSheetByName('出力') || spreadsheet.insertSheet('出力');
  
  // 会社情報の取得
  const companyInfo = {
    name: configSheet.getRange('B2').getValue() || '{{COMPANY_NAME}}',
    address: configSheet.getRange('B3').getValue() || '{{COMPANY_ADDRESS}}',
    phone: configSheet.getRange('B4').getValue() || '{{COMPANY_PHONE}}',
    email: configSheet.getRange('B5').getValue() || '{{COMPANY_EMAIL}}'
  };
  
  // 顧客情報の取得
  const customerInfo = {
    name: configSheet.getRange('B7').getValue() || '{{CUSTOMER_NAME}}',
    address: configSheet.getRange('B8').getValue() || '{{CUSTOMER_ADDRESS}}',
    phone: configSheet.getRange('B9').getValue() || '{{CUSTOMER_PHONE}}',
    email: configSheet.getRange('B10').getValue() || '{{CUSTOMER_EMAIL}}'
  };
  
  // 請求期間の設定
  const today = new Date();
  const invoiceMonth = today.getMonth() + 1;
  const invoiceYear = today.getFullYear();
  
  // 商品明細の取得
  const itemsData = itemsSheet.getRange('A2:E100').getValues();
  const items = itemsData.filter(row => row[0] !== '').map(row => ({
    name: row[0],
    description: row[1],
    quantity: row[2],
    unitPrice: row[3],
    total: row[4]
  }));
  
  generateMonthlyInvoiceDocument(outputSheet, companyInfo, customerInfo, items, invoiceYear, invoiceMonth);
}

function generateMonthlyInvoiceDocument(sheet, company, customer, items, year, month) {
  sheet.clear();
  
  // ヘッダー
  sheet.getRange('A1').setValue('請求書').setFontSize(24).setFontWeight('bold');
  sheet.getRange('A1:F1').merge().setHorizontalAlignment('center');
  
  const invoiceNumber = 'INV-' + year + String(month).padStart(2, '0') + '-001';
  sheet.getRange('A3').setValue('請求書番号: ' + invoiceNumber).setFontWeight('bold');
  sheet.getRange('E3').setValue('請求日: ' + new Date().toLocaleDateString('ja-JP')).setFontWeight('bold');
  
  // 請求期間
  sheet.getRange('A4').setValue('請求期間: ' + year + '年' + month + '月分').setFontWeight('bold');
  
  // 会社情報
  sheet.getRange('A6').setValue('請求者情報:').setFontWeight('bold');
  sheet.getRange('A7').setValue(company.name);
  sheet.getRange('A8').setValue(company.address);
  sheet.getRange('A9').setValue('TEL: ' + company.phone);
  sheet.getRange('A10').setValue('Email: ' + company.email);
  
  // 顧客情報
  sheet.getRange('D6').setValue('請求先:').setFontWeight('bold');
  sheet.getRange('D7').setValue(customer.name + ' 様');
  sheet.getRange('D8').setValue(customer.address);
  
  // 明細ヘッダー
  let currentRow = 13;
  sheet.getRange(currentRow, 1, 1, 5).setValues([['項目', '説明', '数量', '単価', '金額']]);
  sheet.getRange(currentRow, 1, 1, 5).setFontWeight('bold').setBackground('#fce8e6');
  
  // 明細データ
  currentRow++;
  let subtotal = 0;
  items.forEach(item => {
    sheet.getRange(currentRow, 1, 1, 5).setValues([[
      item.name,
      item.description,
      item.quantity,
      '¥' + item.unitPrice.toLocaleString(),
      '¥' + item.total.toLocaleString()
    ]]);
    subtotal += item.total;
    currentRow++;
  });
  
  // 計算
  const taxRate = 0.10;
  const tax = Math.floor(subtotal * taxRate);
  const total = subtotal + tax;
  
  // 金額計算部分
  currentRow += 2;
  sheet.getRange(currentRow, 4).setValue('小計:');
  sheet.getRange(currentRow, 5).setValue('¥' + subtotal.toLocaleString());
  currentRow++;
  sheet.getRange(currentRow, 4).setValue('消費税(10%):');
  sheet.getRange(currentRow, 5).setValue('¥' + tax.toLocaleString());
  currentRow++;
  sheet.getRange(currentRow, 4).setValue('合計金額:').setFontWeight('bold');
  sheet.getRange(currentRow, 5).setValue('¥' + total.toLocaleString()).setFontWeight('bold');
  
  // 支払い情報
  currentRow += 3;
  sheet.getRange(currentRow, 1).setValue('お支払いについて:').setFontWeight('bold');
  currentRow++;
  sheet.getRange(currentRow, 1).setValue('支払期限: ' + getPaymentDueDate());
  currentRow++;
  sheet.getRange(currentRow, 1).setValue('振込先: 銀行名 支店名 普通 口座番号');
  
  // スタイルの調整
  sheet.autoResizeColumns(1, 5);
}

function getPaymentDueDate() {
  const today = new Date();
  const dueDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // 月末
  return dueDate.toLocaleDateString('ja-JP');
}

// 初期化関数
function initializeMonthlyInvoiceSheets() {
  initializeConfigSheet();
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const itemsSheet = spreadsheet.getSheetByName('商品明細') || spreadsheet.insertSheet('商品明細');
  
  itemsSheet.getRange('A1:E1').setValues([['項目', '説明', '数量', '単価', '金額']]);
  itemsSheet.getRange('A1:E1').setFontWeight('bold').setBackground('#fce8e6');
  
  {{ITEMS_DATA}}
}
`,
    instructions: [
      'Google ドライブで新しいGoogle スプレッドシートを作成します',
      'スプレッドシートの「拡張機能」メニューから「Apps Script」を選択します',
      '表示されたエディタに生成されたコードを貼り付けます',
      'コード内の{{COMPANY_NAME}}などのプレースホルダーを実際の値に置き換えます',
      '「initializeMonthlyInvoiceSheets」関数を実行してシートを初期化します',
      '「設定」シートに会社情報と顧客情報を入力します',
      '「商品明細」シートに月次請求項目を入力します',
      '振込先情報をコード内で更新してください',
      '「createMonthlyInvoice」関数を実行して月次請求書を生成します'
    ]
  }
];

export function generateGasCode(templateId: string, data: any): { code: string; instructions: string[] } {
  const template = defaultTemplates.find(t => t.id === templateId || t.name.toLowerCase().replace(/\s+/g, '-') === templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  let code = template.code;
  
  // Replace placeholders with actual data
  code = code.replace(/{{COMPANY_NAME}}/g, data.companyInfo.name);
  code = code.replace(/{{COMPANY_ADDRESS}}/g, data.companyInfo.address);
  code = code.replace(/{{COMPANY_PHONE}}/g, data.companyInfo.phone);
  code = code.replace(/{{COMPANY_EMAIL}}/g, data.companyInfo.email);
  
  code = code.replace(/{{CUSTOMER_NAME}}/g, data.customerInfo.name);
  code = code.replace(/{{CUSTOMER_ADDRESS}}/g, data.customerInfo.address);
  code = code.replace(/{{CUSTOMER_PHONE}}/g, data.customerInfo.phone || '');
  code = code.replace(/{{CUSTOMER_EMAIL}}/g, data.customerInfo.email || '');
  
  // Generate items data
  const itemsData = data.items.map((item: any) => 
    `    ['${item.name.replace(/'/g, "\\'")}', '${(item.description || '').replace(/'/g, "\\'")}', ${item.quantity}, ${item.unitPrice}, ${item.total}]`
  ).join(',\n');
  
  code = code.replace(/{{ITEMS_DATA}}/g, 
    `itemsSheet.getRange('A2:E${data.items.length + 1}').setValues([\n${itemsData}\n  ]);`
  );

  return {
    code,
    instructions: template.instructions
  };
}

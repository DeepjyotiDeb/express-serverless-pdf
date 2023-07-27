const PDFDocument = require('pdfkit');

module.exports.generatePdf = async () => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument();
    //   const stream = doc.pipe(blobStream());
    // console.log('hindi font', HindiFont);
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

    const [hindiFont, gujaratiFont] = await Promise.all([
      fetch('https://fonts.gstatic.com/s/notosans/v28/o-0IIpQlx3QUlC5A4PNb4g.ttf'),
      fetch(
        'https://fonts.gstatic.com/s/notoserifgujarati/v26/hESa6WBlOixO-3OJ1FTmTsmqlBRUJBVkcgNLpdsspzP2HuYycIzu.ttf'
      ),
    ]);
    const hindiArrayBuffer = await hindiFont.arrayBuffer();
    const gujaratirrayBuffer = await gujaratiFont.arrayBuffer();
    // console.log('font array buffer', { font, arrayBuffer });
    doc.registerFont('NotoSansDevanagari-Regular', hindiArrayBuffer);
    doc.registerFont('NotoSansGujarati-Regular', gujaratirrayBuffer);

    doc.font('NotoSansDevanagari-Regular');
    doc.text('some text परीक्षा');
    doc.moveDown();
    // doc.pipe(fs.createWriteStream('output.pdf'));

    doc.font('NotoSansGujarati-Regular');
    doc.text(
      ' એક સરકારી સંસ્થા, એજન્સી કે વિભાગ અન્ય સરકારી સંસ્થા, એજન્સી કે વિભાગ સાથે વાણિજયરહિત (non-commercial) સંદેશાવ્યવહાર કરે, તો તેને સરકારથી સરકાર (026) તરીકે ઓળખવામાં આવે છે. 1૧ ખર્ચાને ઘટાડવા, પ્રક્રિયાઓને સુનિયોજિત બનાવવા અને કાર્યાલયોને વધુ અસરકાર '
    );
    doc.end();
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    // stream.on('finish', () => {
    //   const pdfBlob = stream.toBlob('application/pdf');
    //   resolve(pdfBlob);
    // });
    // stream.on('error', (error) => {
    //   reject(error);
    // });
    doc.on('end', () => {
      try {
        const pdf = Buffer.concat(buffers);
        resolve(pdf);
      } catch (error) {
        reject(error);
      }
    });
  });
};

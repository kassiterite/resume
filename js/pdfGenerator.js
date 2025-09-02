window.generatePdf = async (elementId, fileName) => {
    try {
        // Показываем loading
        const loadingElement = document.createElement('div');
        loadingElement.style.position = 'fixed';
        loadingElement.style.top = '50%';
        loadingElement.style.left = '50%';
        loadingElement.style.transform = 'translate(-50%, -50%)';
        loadingElement.style.background = 'rgba(0,0,0,0.8)';
        loadingElement.style.color = 'white';
        loadingElement.style.padding = '20px';
        loadingElement.style.borderRadius = '10px';
        loadingElement.style.zIndex = '1000';
        loadingElement.textContent = 'Генерация PDF...';
        document.body.appendChild(loadingElement);

        const element = document.getElementById(elementId);

        if (!element) {
            alert('Элемент для печати не найден!');
            return;
        }

        // Используем html2canvas и jsPDF
        const { jsPDF } = window.jspdf;

        const canvas = await html2canvas(element, {
            scale: 2, // Высокое качество
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Добавляем новые страницы если контент не помещается
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Сохраняем PDF
        pdf.save(fileName);

        // Убираем loading
        document.body.removeChild(loadingElement);

    } catch (error) {
        console.error('Ошибка генерации PDF:', error);
        alert('Ошибка при создании PDF: ' + error.message);
    }
};

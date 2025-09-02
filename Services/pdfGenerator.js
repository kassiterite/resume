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
        // Параметры страницы
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);

        // Создаем клон для безопасного manipulation
        const clone = resumeContainer.cloneNode(true);
        clone.style.width = contentWidth + 'mm';
        clone.style.padding = '0';
        clone.style.margin = '0';
        clone.style.visibility = 'hidden';
        document.body.appendChild(clone);

        // Получаем высоту контента
        const contentHeight = clone.scrollHeight;
        const scale = contentWidth / clone.scrollWidth;

        // Удаляем клон
        document.body.removeChild(clone);

        // Рендерим весь контент
        const canvas = await html2canvas(resumeContainer, {
            scale: scale * 2, // Высокое качество
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        });

        const imgData = canvas.toDataURL('image/png', 0.9);

        // Рассчитываем переносы по страницам
        const imgWidth = contentWidth;
        const imgHeight = canvas.height * (contentWidth / canvas.width);
        const pageContentHeight = pageHeight - (margin * 2);

        let currentPosition = 0;
        let pageNumber = 0;

        while (currentPosition < imgHeight) {
            if (pageNumber > 0) {
                pdf.addPage();
            }

            // Вычисляем высоту для текущей страницы
            const remainingHeight = imgHeight - currentPosition;
            const pageImgHeight = Math.min(remainingHeight, pageContentHeight);

            // Вычисляем координаты для crop
            const sourceY = currentPosition * (canvas.height / imgHeight);
            const sourceHeight = pageImgHeight * (canvas.height / imgHeight);

            // Создаем временный canvas для crop
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = sourceHeight;
            const ctx = tempCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);

            const pageImgData = tempCanvas.toDataURL('image/png', 0.9);
            const scaledPageHeight = pageImgHeight;

            pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, scaledPageHeight);

            currentPosition += pageContentHeight;
            pageNumber++;
        }

        pdf.save(fileName);
        console.log("PDF создан, страниц: " + pageNumber);
        // Убираем loading
        document.body.removeChild(loadingElement);

    } catch (error) {
        console.error('Ошибка генерации PDF:', error);
        alert('Ошибка при создании PDF: ' + error.message);
    }
};
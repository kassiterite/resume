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
        const resumeContainer = document.getElementById(elementId);
        if (!resumeContainer) throw new Error("Контейнер не найден");

        const jsPDF = window.jspdf.jsPDF;

        // Создаем массив для хранения промисов
        const sectionPromises = [];
        const sections = [];

        // Собираем все основные блоки
        const header = resumeContainer.querySelector('.header');
        const sectionElements = resumeContainer.querySelectorAll('.section');

        if (header) sections.push(header);
        sectionElements.forEach(section => sections.push(section));

        // Рендерим все секции параллельно
        for (let section of sections) {
            const promise = html2canvas(section, {
                scale: 1.5,
                useCORS: true,
                backgroundColor: '#ffffff'
            }).then(canvas => {
                return {
                    canvas: canvas,
                    height: (canvas.height * 180) / canvas.width // 180mm ширина контента
                };
            });
            sectionPromises.push(promise);
        }

        // Ждем завершения всех рендеров
        const renderedSections = await Promise.all(sectionPromises);

        // Создаем PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 15;
        const pageHeight = 267;
        let currentY = margin;
        let pageNumber = 1;

        for (let i = 0; i < renderedSections.length; i++) {
            const { canvas, height } = renderedSections[i];

            // Проверяем, нужна ли новая страница
            if (currentY + height > pageHeight) {
                pdf.addPage();
                pageNumber++;
                currentY = margin;
            }

            const imgData = canvas.toDataURL('image/png', 0.9);
            pdf.addImage(imgData, 'PNG', margin, currentY, 180, height);
            currentY += height + 10;
        }

        pdf.save(fileName);
        console.log(`PDF создан! Страниц: ${pageNumber}`);


    } catch (error) {
        console.error('Ошибка генерации PDF:', error);
        alert('Ошибка при создании PDF: ' + error.message);
    }
};
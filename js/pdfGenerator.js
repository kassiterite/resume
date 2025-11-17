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
        if (!resumeContainer) throw new Error("Контейнер резюме не найден");

        const jsPDF = window.jspdf.jsPDF;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const margin = 15;
        const contentWidth = 180;
        const pageHeight = 297;
        const usablePageHeight = pageHeight - (margin * 2);

        // Собираем все контейнеры
        const containers = [];

        const header = resumeContainer.querySelector('.header');
        if (header) containers.push({ element: header, name: 'Шапка' });

        const sections = resumeContainer.querySelectorAll('.section');
        sections.forEach((section, index) => {
            containers.push({
                element: section,
                name: `Секция ${index + 1}`
            });
        });

        let currentY = margin;
        let currentPage = 1;
        let pageBreaks = 0;

        console.log(`📊 Начало генерации PDF. Контейнеров: ${containers.length}`);

        for (let i = 0; i < containers.length; i++) {
            const container = containers[i];

            // Рендерим контейнер
            const canvas = await html2canvas(container.element, {
                scale: 1.5,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const containerHeight = (canvas.height * contentWidth) / canvas.width;
            const availableSpace = usablePageHeight - (currentY - margin);

            console.log(`\n--- ${container.name} ---`);
            console.log(`Высота: ${containerHeight.toFixed(1)}mm`);
            console.log(`Текущая позиция Y: ${currentY.toFixed(1)}mm`);
            console.log(`Доступное место: ${availableSpace.toFixed(1)}mm`);

            // ПРОВЕРКА ВЛЕЗАНИЯ
            if (containerHeight > availableSpace) {
                console.log(`🔄 ${container.name} НЕ ВЛЕЗАЕТ! Требуется перенос.`);

                // Создаем новую страницу
                pdf.addPage();
                currentPage++;
                pageBreaks++;
                currentY = margin;

                console.log(`✅ Создана страница ${currentPage}`);
            } else {
                console.log(`✅ ${container.name} влезает на текущую страницу`);
            }

            // Добавляем контейнер
            const imgData = canvas.toDataURL('image/png', 0.9);
            pdf.addImage(imgData, 'PNG', margin, currentY, contentWidth, containerHeight);

            currentY += containerHeight + 10; // Отступ между контейнерами

            console.log(`📝 ${container.name} добавлен на страницу ${currentPage}`);
            console.log(`Новая позиция Y: ${currentY.toFixed(1)}mm`);
        }

        console.log(`\n🎉 Генерация завершена!`);
        console.log(`📄 Всего страниц: ${currentPage}`);
        console.log(`🔄 Переносов: ${pageBreaks}`);

        pdf.save(fileName);



    } catch (error) {
        console.error('Ошибка генерации PDF:', error);
        alert('Ошибка при создании PDF: ' + error.message);
    }
};
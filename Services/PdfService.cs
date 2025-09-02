using Microsoft.JSInterop;
using System.Threading.Tasks;

namespace Resume.Services
{
    public class PdfService
    {
        private readonly IJSRuntime _jsRuntime;

        public PdfService(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public async Task GeneratePdfAsync(string elementId = "resume-container", string fileName = "resume.pdf")
        {
            await _jsRuntime.InvokeVoidAsync("generatePdf", elementId, fileName);
        }
    }
}
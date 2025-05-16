import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { getFirstAidGuide } from '../../api';
import { FirstAidGuide } from '../../types';

const FirstAidPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [guide, setGuide] = useState<FirstAidGuide | null>(null);
  const guideRef = React.useRef<HTMLDivElement>(null);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await getFirstAidGuide(searchTerm);
      setGuide(response);
    } catch (error) {
      console.error('Error fetching first aid guide:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShare = async () => {
    if (!guide) return;
    const shareText = `First Aid: ${guide.symptom}\n\nSolution:\n${guide.solution}\n\nDescription:\n${guide.description}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `First Aid: ${guide.symptom}`,
          text: shareText,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('First aid instructions copied to clipboard!');
      } catch (err) {
        alert('Failed to copy to clipboard.');
      }
    } else {
      alert('Sharing is not supported on this device.');
    }
  };

  const handleDownload = () => {
    if (!guide) return;
    const content = `First Aid: ${guide.symptom}\n\nSolution:\n${guide.solution}\n\nDescription:\n${guide.description}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${guide.symptom.replace(/\s+/g, '_')}_FirstAid.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (!guideRef.current) return;
    const printContents = guideRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>First Aid Guide</title>');
      printWindow.document.write('<style>body{font-family:sans-serif;padding:2rem;}h2{margin-top:0;}@media print{button{display:none;}}</style>');
      printWindow.document.write('</head><body >');
      printWindow.document.write(printContents);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };
  
  // Common first aid topics
  const commonTopics = [
    'Cuts and Scrapes',
    'Burns',
    'Choking',
    'Heart Attack',
    'Stroke',
    'Allergic Reaction',
    'Broken Bone',
    'Bleeding',
    'Poisoning',
    'Seizure',
    'Heat Stroke',
    'Hypothermia',
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">First Aid Guide</h2>
          <p className="text-gray-600">
            Search for first aid instructions for common emergencies and medical situations.
          </p>
        </div>
        
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a condition or symptom..."
              className="flex-1 rounded-r-none"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              }
            />
            <Button
              type="submit"
              variant="primary"
              className="rounded-l-none"
              isLoading={isLoading}
            >
              Search
            </Button>
          </div>
        </form>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Common Topics</h3>
          <div className="flex flex-wrap gap-2">
            {commonTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setSearchTerm(topic);
                  // Trigger search immediately
                  getFirstAidGuide(topic)
                    .then(response => setGuide(response))
                    .catch(error => console.error('Error fetching first aid guide:', error));
                }}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </Card>
      
      {guide && (
        <Card>
          <div className="mb-4 flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-900">{guide.symptom}</h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                }
                onClick={handleShare}
              >
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16V4H4zm4 4h8v8H8V8z" />
                  </svg>
                }
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
          </div>
          
          <div ref={guideRef}>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Solution</h3>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                <p className="text-blue-700 whitespace-pre-wrap">{guide.solution}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{guide.description}</p>
            </div>
            
            {guide.mediaUrls && guide.mediaUrls.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Helpful Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.mediaUrls.map((url, index) => {
                    // Check if it's a YouTube URL
                    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
                    
                    if (isYouTube) {
                      return (
                        <div key={index} className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden">
                          <iframe
                            src={url}
                            title={`Resource ${index + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                      );
                    } else {
                      // Assume it's an image
                      return (
                        <div key={index} className="rounded-md overflow-hidden">
                          <img
                            src={url}
                            alt={`Resource ${index + 1}`}
                            className="w-full h-auto"
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between">
              <Button
                variant="outline"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                }
              >
                Back to Search
              </Button>
              <Button
                variant="primary"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                }
              >
                Get Emergency Help
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {!guide && !isLoading && (
        <Card>
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for First Aid Information</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Enter a symptom, condition, or emergency situation to get detailed first aid instructions.
            </p>
          </div>
        </Card>
      )}
      
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Important Disclaimer</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                This first aid guide is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition or emergency.
              </p>
              <p className="mt-2">
                In case of a serious or life-threatening emergency, call your local emergency number (e.g., 911 in the US) immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstAidPage;
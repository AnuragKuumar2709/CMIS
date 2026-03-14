import { FileText } from 'lucide-react';

const Exams: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
        <p className="text-gray-600">Manage exams, grades, and academic performance</p>
      </div>
      
      <div className="card text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Exams Module</h3>
        <p className="mt-1 text-sm text-gray-500">
          Exam management functionality coming soon...
        </p>
      </div>
    </div>
  );
};

export default Exams;

interface But {
    label: string;
    onClick?: () => void;
    className?: string; 
  }

export default function Button({label, onClick, className}: But){
    return  <button className="w-full text-white bg-gray-800 hover: bg-gray-800 focus:ring-4 focus:ring-gray-300 
    font-medium rounded-lg text-sm px-5 py-2.5 py-2.5 me-2 mb-2"  onClick={onClick}>{label}</button>
}
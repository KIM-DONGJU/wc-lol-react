import CommonButton from './CommonButton';

interface CommonModalProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
  confirmName?: string;
  onConfirm: () => void;
}

export default function CommonModal({
  title,
  children,
  className,
  onClose,
  confirmName = '완료',
  onConfirm,
}: CommonModalProps) {
  return (
    <div className="bg-black bg-opacity-30 fixed w-screen h-screen left-0 top-0 flex justify-center items-center z-20">
      <div className={`bg-white rounded-xl flex flex-col ${className}`}>
        <div className="border-gray border-b px-12 py-7">
          <p className="text-3xl font-bold text-light-black">{title}</p>
          <div className="mt-3">{children}</div>
        </div>
        <div className="flex items-center w-full">
          <CommonButton
            className="flex-1 text-light-black font-medium border-gray border-r"
            variant="text"
            onClick={onClose}
          >
            <span className="text-2xl">취소</span>
          </CommonButton>
          <CommonButton
            className="flex-1 text-success font-medium"
            variant="text"
            onClick={onConfirm}
          >
            <span className="text-2xl">{confirmName}</span>
          </CommonButton>
        </div>
      </div>
    </div>
  );
}

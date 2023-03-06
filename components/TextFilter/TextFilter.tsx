import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BsSearch } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';

interface ITextFilterProps {
  className?: string;
  enteredText?: string;
  onSubmit?: (value: string) => void;
}

const TextFilter: React.FC<ITextFilterProps> = ({
  className,
  onSubmit,
  enteredText
}) => {
  const [input, setInput] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit?.(input);
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setInput('');
    onSubmit?.('');
  };

  return (
    <div className={`text-filter-wrap ${className}`}>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            className="dialog-trigger-button"
            data-entered={enteredText && enteredText.length > 0}
          >
            <BsSearch />
            {enteredText && (
              <>
                <span>{enteredText}</span>
                <button
                  className="text-filter-clearance"
                  onClick={handleClickClear}
                >
                  <MdClear />
                </button>
              </>
            )}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal className={className}>
          <Dialog.Overlay className={`dialog-overlay ${className}`} />
          <Dialog.Content
            className={`dialog-content text-filter-content ${className}`}
          >
            <div className="text-filter-input">
              <input
                type="text"
                placeholder="🔍 검색어를 입력하세요."
                maxLength={15}
                value={input}
                onChange={handleChangeInput}
                onKeyDown={handleKeydown}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default TextFilter;

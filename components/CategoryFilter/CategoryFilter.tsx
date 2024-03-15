import * as Popover from '@radix-ui/react-popover';
import { RiMenu3Fill } from 'react-icons/ri';
import { IoCloseSharp } from 'react-icons/io5';
import { useGetCategory } from '@core/queries/category';

interface ICategoryFilterProps {
  className?: string;
  onChange?: (value: string) => void;
  value: string[];
}

const CategoryFilter: React.FC<ICategoryFilterProps> = ({
  className,
  onChange,
  value
}) => {
  const { data } = useGetCategory();

  return (
    <div className={`category-filter-wrap ${className}`}>
      <Popover.Root>
        <Popover.Trigger className="btn-filter">
          <RiMenu3Fill />
          {value.length > 0 && <div className="point" />}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={`category-filter-content ${className}`}>
            <div className="category-content-wrap">
              <div className="category-list">
                <p>보고싶은 카테고리를 선택하세요</p>
                <ul>
                  {data?.data.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => onChange?.(item.name)}
                      className={`${
                        value.find((v) => v === item.name) ? 'selected' : ''
                      }`}
                      style={
                        value.find((v) => v === item.name)
                          ? {
                              background: item.color,
                              borderColor: item.color
                            }
                          : undefined
                      }
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Popover.Close className="btn-close">
              <IoCloseSharp />
            </Popover.Close>
            <Popover.Arrow className="icon-arrow" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

export default CategoryFilter;

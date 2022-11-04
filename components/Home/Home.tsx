interface IHomeProps {
  className?: string;
}

const Home: React.FC<IHomeProps> = ({ className }) => {
  return (
    <div className={`contents ${className}`}>
      <div className="title-wrap">
        <h2>포스트</h2>
      </div>
    </div>
  );
};

export default Home;

import './ProgressBar.module.scss';

const ProgressBar = (props) => {
  const { containerStyles, fillerStyles, labelStyles, completed } = props;

  return (
    <div className='progress-bar-container' style={containerStyles}>
      <div className='progress-bar-meter' style={{ ...fillerStyles, width: `${completed}%` }}>
        <div />
        <span style={labelStyles}>{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;

const ImageContainer = ({ url, imgSrc, imgAlt }) => {
  return (
    <div className="mx-auto my-4 max-w-3xl rounded bg-gray-200 shadow-lg">
      <div className="flex items-center justify-between rounded-t bg-white px-3 py-1 lg:px-4 lg:py-2">
        <div className="flex items-center space-x-2">
          <div className="h-2.5 w-2.5 rounded-full bg-gray-200"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-gray-200"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-gray-200"></div>
        </div>
        <div className="flex items-center rounded bg-gray-50 px-4 py-1">
          <span className="text-xs text-gray-400">{url}</span>
        </div>
      </div>
      <div>
        <img className="h-auto w-full rounded-b" src={imgSrc} alt={imgAlt} />
      </div>
    </div>
  );
};

export default ImageContainer;

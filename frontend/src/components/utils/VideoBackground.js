function VideoBackground({ video }) {
  return (
    <>
      {video && (
        <video autoPlay='autoplay' muted='muted' loop='loop'>
          <source src={video} type='video/mp4' />
        </video>
      )}
    </>
  );
}

export default VideoBackground;

import React from 'react'
import { Audio } from 'react-loader-spinner';
const Loader = () => {
  return (
    <div>
      <div
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Audio
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="audio-loading"
                wrapperStyle={{}}
                wrapperClass="wrapper-class"
                visible={true}
              />{" "}
            </div>
    </div>
  )
}

export default Loader


import React from "react";
import Blockies from "react-blockies";

export default function Address(props) {
  const address = props.value || props.address;
  
  let displayAddress = address?.substr(0, 5) + "..." + address?.substr(-4);

  return (
    <span>
      <span style={{ verticalAlign: "middle" }}>
        <Blockies seed={address.toLowerCase()} size={18} scale={props.fontSize ? props.fontSize / 7 : 4} />
      </span>
      <span style={{ verticalAlign: "middle", paddingLeft: 5, fontSize: props.fontSize ? props.fontSize : 28 }}>
      {displayAddress}
      </span>
    </span>
  );
}

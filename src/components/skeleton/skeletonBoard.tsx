import React from "react"
import ContentLoader from "react-content-loader"

const SkeletonBoard = (props:any) => (
  <ContentLoader 
  speed={2}
  width={1440}
  height={800}
  viewBox="0 0 1440 800"
  backgroundColor="#f3f3f3"
  foregroundColor="#ecebeb"
  {...props}
>
  <rect x="62" y="29" rx="10" ry="10" width="218" height="31" /> 
  <rect x="1257" y="17" rx="7" ry="7" width="166" height="21" /> 
  <rect x="63" y="95" rx="12" ry="12" width="305" height="132" /> 
  <rect x="415" y="98" rx="12" ry="12" width="302" height="136" /> 
  <rect x="760" y="97" rx="12" ry="12" width="316" height="133" /> 
  <rect x="1121" y="97" rx="12" ry="12" width="302" height="135" /> 
  <rect x="62" y="254" rx="12" ry="12" width="305" height="132" /> 
  <rect x="414" y="257" rx="12" ry="12" width="302" height="136" /> 
  <rect x="759" y="256" rx="12" ry="12" width="316" height="133" /> 
  <rect x="1120" y="256" rx="12" ry="12" width="302" height="135" /> 
  <rect x="63" y="412" rx="12" ry="12" width="305" height="132" /> 
  <rect x="415" y="415" rx="12" ry="12" width="302" height="136" /> 
  <rect x="760" y="414" rx="12" ry="12" width="316" height="133" /> 
  <rect x="1121" y="414" rx="12" ry="12" width="302" height="135" /> 
  <rect x="62" y="579" rx="12" ry="12" width="305" height="132" /> 
  <rect x="414" y="582" rx="12" ry="12" width="302" height="136" /> 
  <rect x="759" y="581" rx="12" ry="12" width="316" height="133" /> 
  <rect x="1120" y="581" rx="12" ry="12" width="302" height="135" /> 
  <rect x="64" y="748" rx="12" ry="12" width="305" height="132" /> 
  <rect x="416" y="751" rx="12" ry="12" width="302" height="136" /> 
  <rect x="761" y="750" rx="12" ry="12" width="316" height="133" /> 
  <rect x="1122" y="750" rx="12" ry="12" width="302" height="135" /> 
  <rect x="98" y="925" rx="12" ry="12" width="290" height="132" /> 
  <rect x="420" y="925" rx="12" ry="12" width="290" height="136" /> 
  <rect x="742" y="926" rx="12" ry="12" width="290" height="133" /> 
  <rect x="1064" y="925" rx="12" ry="12" width="290" height="135" />
</ContentLoader>
)

export default SkeletonBoard
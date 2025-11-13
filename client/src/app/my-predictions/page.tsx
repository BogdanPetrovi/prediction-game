import PredictionBox from "@/components/ui/PredictionBox"

const MyPredictionsPage = () => {
  return ( 
    <div className="h-[calc(98vh-9.5rem)] w-full flex flex-col justify-start gap-3 px-10 select-none">
      <h1 className="text-4xl font-semibold">Your latest predictions</h1>
      <div className="flex gap-5">
        <PredictionBox 
          teamLogo="https://img-cdn.hltv.org/teamlogo/JMeLLbWKCIEJrmfPaqOz4O.svg?ixlib=java-2.1.0&s=c02caf90234d3a3ebac074c84ba1ea62" 
          result="1:2"
        />
        <PredictionBox 
          correctPrediction 
          teamLogo="https://img-cdn.hltv.org/teamlogo/RWbHH6RA8uGwJurGeLFvSr.png?ixlib=java-2.1.0&w=50&s=3d251032e156cab2f6df8c630ca29745"
          result="2:0" />
        <PredictionBox 
          teamLogo="https://img-cdn.hltv.org/teamlogo/x7znFH8_QjLXOQRyR2y7Xp.png?ixlib=java-2.1.0&w=50&s=e4435bf7c351b546b867adc1d7886795"
          result="0:2" />
        <PredictionBox 
          teamLogo="https://img-cdn.hltv.org/teamlogo/4vM_jGA-gAmOO3D19rxR1F.png?ixlib=java-2.1.0&w=50&s=e84a0026333c0d681a146ae08e1d318f"
          result="0:2" />
        <PredictionBox 
          correctPrediction
          teamLogo="https://img-cdn.hltv.org/teamlogo/jS__cj2F09Bl8qBU_CvkQR.png?ixlib=java-2.1.0&w=50&s=11e6eacde0fea931c65c2437b1568027"
          result="2:1" />
        <PredictionBox 
          teamLogo="https://img-cdn.hltv.org/teamlogo/fmqTgF6Ziw0uied7MO3_ri.png?ixlib=java-2.1.0&w=50&s=255b5a4c460ad03161509ff7eb77b2dc"
          result="1:2" />
        <PredictionBox 
          correctPrediction
          teamLogo="https://img-cdn.hltv.org/teamlogo/4S22uk_gnZTiQiI-hhH4yp.png?ixlib=java-2.1.0&w=50&s=3619ddf1d490573ab3dc261b8c2f3f6f"
          result="2:1" />
        <PredictionBox 
          teamLogo="https://img-cdn.hltv.org/teamlogo/-ttGATBV_P_HcZazxNNtIb.png?ixlib=java-2.1.0&w=50&s=ba94f7812d1f47183a83f3f34ab959eb"
          result="1:2" />
        <PredictionBox 
          teamLogo="https://img-cdn.hltv.org/teamlogo/QGPDS3Z2-aMXwCYVgA4RWH.png?ixlib=java-2.1.0&w=50&s=ec528d7e9d0f9b6b4bac227901fb1590"
          result="1:2" />
        <PredictionBox 
          correctPrediction
          teamLogo="https://img-cdn.hltv.org/teamlogo/9vOlYp2U_z0vXPb9aLK-4r.png?ixlib=java-2.1.0&w=50&s=22abd048c4d198e504696f27e8ff68d1"
          result="2:1" />
        <PredictionBox 
          teamLogo="https://img-cdn.hltv.org/teamlogo/G4ZrdB0-q41USPd_z27IQA.png?ixlib=java-2.1.0&w=50&s=9c15ddf70f9c66399d4a47e0d8e93511"
          result="1:2" />
      </div>
      
    </div>
  )
}

export default MyPredictionsPage
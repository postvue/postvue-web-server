import React, { useEffect, useState } from 'react';
interface propKeyValue {
  key: string;
  value: string;
}
interface BodyAdaptPropElement {
  adaptPropList: propKeyValue[];
}

const BodyAdaptPropElement: React.FC<BodyAdaptPropElement> = ({
  adaptPropList,
}) => {
  const body = document.body;
  const [bodyPropList, setBodyPropList] = useState<Map<string, string>>(
    new Map(),
  );
  useEffect(() => {
    const tempBodyPropsList = new Map(bodyPropList);
    try {
      adaptPropList.forEach((value) => {
        const prop = body.style.getPropertyValue(value.key);
        tempBodyPropsList.set(value.key, prop);
      });
    } catch (e) {
      console.error(e);
    }
    setBodyPropList(tempBodyPropsList);

    try {
      adaptPropList.forEach((prop) => {
        body.style.setProperty(prop.key, prop.value);
      });
    } catch (e) {
      console.error(e);
    }

    return () => {
      Array.from(bodyPropList.entries()).forEach((value) => {
        try {
          body.style.setProperty(value[0], value[1]);
        } catch (e) {
          console.error(e);
        }
      });
    };
  }, []);

  return <></>;
};

export default BodyAdaptPropElement;

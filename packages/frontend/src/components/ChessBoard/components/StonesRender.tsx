import React from 'react';
import styled from 'styled-components';
import times from 'lodash/times';
import SMALL_PEARL_1 from 'assests/images/small-pearl-1.png';
import SMALL_PEARL_2 from 'assests/images/small-pearl-2.png';
import SMALL_PEARL_3 from 'assests/images/small-pearl-3.png';
import SMALL_PEARL_4 from 'assests/images/small-pearl-4.png';
import SMALL_PEARL_5 from 'assests/images/small-pearl-5.png';
import BULK_SMALL_PEARLS from 'assests/images/bulk-small-pearls.png';
import BIG_PEARL from 'assests/images/big-pearl.png';

interface IStonesRenderProps {
  smallStonesNum: number;
  bigStonesNum: number;
}

const StonesWrapper = styled.div<{ size: string }>`
  --small-stone-width: 120px;
  --big-stone-width: 80px;
  position: relative;
  width: ${({ size }) =>
    size === 'small' ? 'var(--small-stone-width)' : 'var(--big-stone-width)'};

  > &:after {
    padding-bottom: 100%;
  }

  > img {
    height: 100%;
    width: 100%;
  }
`;

export const StonesRender: React.FC<IStonesRenderProps> = ({
  smallStonesNum,
  bigStonesNum,
}) => {
  const smallStonesImgSrc = React.useMemo(
    () =>
      ({
        0: null,
        1: SMALL_PEARL_1,
        2: SMALL_PEARL_2,
        3: SMALL_PEARL_3,
        4: SMALL_PEARL_4,
        5: SMALL_PEARL_5,
      }[smallStonesNum] || BULK_SMALL_PEARLS),
    [smallStonesNum],
  );

  const isHaveStones = bigStonesNum > 0 || smallStonesNum > 0;
  if (!isHaveStones) {
    return null;
  }

  return (
    <>
      {smallStonesNum > 0 && (
        <StonesWrapper size="small">
          <img src={smallStonesImgSrc} alt="stone" />
        </StonesWrapper>
      )}
      {times(bigStonesNum, (num) => (
        <StonesWrapper key={num} size="big">
          <img src={BIG_PEARL} alt="stone" />
        </StonesWrapper>
      ))}
    </>
  );
};

import React from 'react';
import styled from 'styled-components';

const Pattern = ({ children }) => {
  return (
    <StyledWrapper>
      <div className="container">
        {children ? <div className="content-slot">{children}</div> : null}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;

  .container {
    width: 100%;
    min-height: 100vh;
    background: repeating-linear-gradient(45deg, #92c9b1, #92c9b1 20px, #b3e0d2 20px, #b3e0d2 40px);
  }

  .content-slot {
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: 100vh;
  }
`;

export default Pattern;

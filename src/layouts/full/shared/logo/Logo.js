import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logoDark from 'src/assets/images/logos/2.png';
import logoDarkRTL from 'src/assets/images/logos/4.png';
import logoLight from 'src/assets/images/logos/3.png';
import logoLightRTL from 'src/assets/images/logos/1.png';
import { styled } from '@mui/material';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);

  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? '45px' : '240px',
    overflow: 'hidden',
    display: 'block',
    marginLeft:customizer.isCollapse ? '0px' : '5px',
  }));

  const logoHeight = customizer.isCollapse ? '33px' : '30px'; 

  if (customizer.activeDir === 'ltr') {
    return (
      <LinkStyled to="/" style={{ display: 'flex', alignItems: 'center' }}>
        {customizer.activeMode === 'dark' ? (
          <img src={logoLight} alt="Logo Light" style={{ height: logoHeight }} />
        ) : (
          <img src={logoDark} alt="Logo Dark" style={{ height: logoHeight }} />
        )}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled to="/" style={{ display: 'flex', alignItems: 'center' }}>
      {customizer.activeMode === 'dark' ? (
        <img src={logoDarkRTL} alt="Logo Dark RTL" style={{ height: logoHeight }} />
      ) : (
        <img src={logoLightRTL} alt="Logo Light RTL" style={{ height: logoHeight }} />
      )}
    </LinkStyled>
  );
};

export default Logo;

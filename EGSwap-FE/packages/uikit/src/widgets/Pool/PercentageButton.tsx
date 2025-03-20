import styled from "styled-components";
import { Button } from "../../components/Button";
import { useTheme } from "@pancakeswap/hooks";

interface PercentageButtonProps {
  onClick: () => void;
  pool: boolean;
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`;

const PercentageButton: React.FC<React.PropsWithChildren<PercentageButtonProps>> = ({ children, onClick, pool = false }) => {
  const theme = useTheme();
  return (
    <StyledButton scale="xs" mx="2px" p="4px 16px" variant="tertiary" onClick={onClick} style={{...(pool && {height: 45, border: theme.isDark? '2px solid #0e999d' : 'none', background: theme.isDark? 'transparent' : '#fff', borderRadius: 6, color: '#0e999d'})}}>
      {children}
    </StyledButton>
  );
};

export default PercentageButton;

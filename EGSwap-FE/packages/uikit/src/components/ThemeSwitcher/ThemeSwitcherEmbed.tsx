import { memo } from "react";
import { SunIcon, MoonIcon, HotIcon } from "../Svg";
import styled from "styled-components";

const ThemeButton = styled.button<{ isActive: boolean, isBlue?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  background: ${({ isActive, isBlue }) => (isActive ? isBlue ? "#6630FF" : "#22CE77" : "transparent")};
  margin: 0 4px;

  svg {
    fill: ${({ theme, isActive }) => (isActive ? "white" : "#6B7280")};
  }

  &:hover {
    opacity: 0.7;
  }
`;

const ThemeContainer = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.isDark ? '#2f2f2f' : '#E1E1E1'};
 
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.isDark ? '#3c3c3c' : '#d1d1d1'};
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
 
`;

export interface Props {
  resolvedTheme: string;
  toggleTheme: (theme: "light" | "dark" | "blue") => void;
}

const ThemeSwitcher: React.FC<React.PropsWithChildren<Props>> = ({ resolvedTheme, toggleTheme }) => {
  console.log("resolvedTheme", resolvedTheme);

  return (
    <ThemeContainer>
      <ButtonGroup>
        <ThemeButton
          isActive={resolvedTheme === "light"}
          isBlue={resolvedTheme === "blue"}
          onClick={() => toggleTheme("light")}
        >
          <SunIcon width="20px" />
        </ThemeButton>
        <ThemeButton
          isActive={resolvedTheme === "blue"}
          isBlue={resolvedTheme === "blue"}
          onClick={() => toggleTheme("blue")}
        >
          <HotIcon width="20px" />
        </ThemeButton>
        <ThemeButton
          isActive={resolvedTheme === "dark"}
          isBlue={resolvedTheme === "blue"}
          onClick={() => toggleTheme("dark")}
        >
          <MoonIcon width="20px" />
        </ThemeButton>
      </ButtonGroup>
    </ThemeContainer>
  );
};

export default memo(ThemeSwitcher, (prev, next) => prev.resolvedTheme === next.resolvedTheme);

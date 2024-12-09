import { FC, ReactNode } from "react";

import tw from "styled-cva";

const LayoutContainer = tw.div`
  min-h-screen 
  bg-base-100
`;

const LayoutInner = tw.div`
  container mx-auto px-4 py-8
`;

const Header = tw.header`
  mb-8
`;

const Title = tw.h1`
  flex items-center gap-2 text-3xl font-bold
`;

const Subtitle = tw.p`
  mt-2 opacity-90
`;

interface LayoutProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ title, subtitle, children }) => {
  return (
    <LayoutContainer>
      <LayoutInner>
        <Header>
          <Title>{title}</Title>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </Header>
        {children}
      </LayoutInner>
    </LayoutContainer>
  );
};

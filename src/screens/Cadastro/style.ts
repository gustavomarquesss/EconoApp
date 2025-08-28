import styled from "styled-components";

export const Section = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--cor-neutra-dark-medium);
  padding: 2rem;
  position: relative;
`;

export const SectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--cor-neutra-dark);
  border-radius: var(--border-radius-l);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--cor-neutra-dark);
  padding: var(--padding-xl);
  width: 100%;
  max-width: 500px;
  min-height: 600px;
  color: var(--cor-neutra-light);
  position: relative;
`;

export const Title = styled.h1`
  font-size: var(--fonte-xxl);
  color: var(--cor-neutra-light);
  margin-bottom: 20px;
  text-align: center;
`;

export const Description = styled.p`
  font-size: var(--fonte-md);
  margin-bottom: 30px;
  text-align: center;
`;

export const Illustration = styled.img`
  width: 500px;
  margin-left: 50px;
`;
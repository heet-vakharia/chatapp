import styled from "styled-components";
import { Link } from "react-router-dom";
export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  flex-direction: column;
`;
export const InputPrimary = styled.input`
  height: 5rem;
  width: 30rem;
  padding: 1rem;
  border: none;
  font-size: 2rem;
  margin: 1rem;
  &:hover {
    border-bottom: 1px solid #000;
  }
  &:active,
  &:focus {
    outline: none;
    border-bottom: 1px solid #000;
  }
`;
export const FormHeading = styled.h1`
  font-size: 5rem;
  margin-bottom: 2rem;
`;
export const BTNPrimary = styled.button`
  background: none;
  color: #000;
  height: 5rem;
  padding: 1rem;
  cursor: pointer;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  border: none;
  border: 1px solid transperent;
  font-family: "Josefin Slab", serif;
  &:hover,
  &:active,
  &:focus {
    outline: none;
    border: 1px solid #000;
    border-radius: 0.5rem;
  }
`;
export const LinkPrimary = styled(Link)`
  color: #000;
  text-decoration: none;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  padding: 1rem;
  &:hover {
    border-bottom: 1px solid #000;
  }
`;
export const NavBarPrimary = styled.nav`
  display: flex;
  justify-content: space-between;
`;
export default styled;

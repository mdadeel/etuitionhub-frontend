import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Heading } from "../heading";

describe("Heading component", () => {
  it("renders default h2 element", () => {
    render(<Heading>Test Title</Heading>);
    const el = screen.getByRole("heading", { level: 2 });
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("H2");
    expect(el).toHaveTextContent("Test Title");
  });

  it("renders h1 when level=1", () => {
    render(<Heading level={1}>Primary Heading</Heading>);
    const el = screen.getByRole("heading", { level: 1 });
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("H1");
  });

  it("renders polymorphic tag when 'as' prop is passed", () => {
    render(<Heading as="h3" level={1}>Polymorphic Heading</Heading>);
    const el = screen.getByRole("heading", { level: 3 });
    expect(el).toBeInTheDocument();
    expect(el.tagName).toBe("H3");
  });

  it("applies display size class when size='display'", () => {
    render(<Heading size="display">Hero Title</Heading>);
    const el = screen.getByRole("heading", { level: 2 });
    expect(el.className).toContain("font-extrabold");
  });
});

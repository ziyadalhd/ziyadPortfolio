import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MessageContent } from "./renderMessageContent";

describe("MessageContent", () => {
  it("renders plain text as a paragraph", () => {
    render(<MessageContent content="Hello world" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("strips bold markdown (**text**)", () => {
    render(<MessageContent content="**bold text**" />);
    expect(screen.getByText("bold text")).toBeInTheDocument();
    expect(screen.queryByText(/\*\*/)).not.toBeInTheDocument();
  });

  it("strips bold markdown (__text__)", () => {
    render(<MessageContent content="__bold text__" />);
    expect(screen.getByText("bold text")).toBeInTheDocument();
  });

  it("strips italic markdown (*text*)", () => {
    render(<MessageContent content="*italic text*" />);
    expect(screen.getByText("italic text")).toBeInTheDocument();
  });

  it("strips italic markdown (_text_)", () => {
    render(<MessageContent content="_italic text_" />);
    expect(screen.getByText("italic text")).toBeInTheDocument();
  });

  it("strips inline code backticks", () => {
    render(<MessageContent content="`code here`" />);
    expect(screen.getByText("code here")).toBeInTheDocument();
    expect(screen.queryByText(/`/)).not.toBeInTheDocument();
  });

  it("strips fenced code blocks", () => {
    render(<MessageContent content={"```\nconst x = 1;\n```"} />);
    expect(screen.queryByText(/```/)).not.toBeInTheDocument();
  });

  it("strips markdown links and renders only the label", () => {
    render(
      <MessageContent content="Check out [my GitHub](https://github.com/example)" />,
    );
    expect(screen.getByText(/my GitHub/)).toBeInTheDocument();
    expect(screen.queryByText(/https:\/\//)).not.toBeInTheDocument();
    expect(screen.queryByText(/\[/)).not.toBeInTheDocument();
  });

  it("renders an unordered list", () => {
    render(<MessageContent content={"- item one\n- item two\n- item three"} />);
    const list = document.querySelector("ul");
    expect(list).toBeInTheDocument();
    expect(screen.getByText("item one")).toBeInTheDocument();
    expect(screen.getByText("item two")).toBeInTheDocument();
    expect(screen.getByText("item three")).toBeInTheDocument();
  });

  it("renders a bullet list with • character", () => {
    render(<MessageContent content={"• first\n• second"} />);
    expect(document.querySelector("ul")).toBeInTheDocument();
    expect(screen.getByText("first")).toBeInTheDocument();
  });

  it("renders an ordered list", () => {
    render(<MessageContent content={"1. first\n2. second\n3. third"} />);
    const list = document.querySelector("ol");
    expect(list).toBeInTheDocument();
    expect(screen.getByText("first")).toBeInTheDocument();
    expect(screen.getByText("third")).toBeInTheDocument();
  });

  it("renders multiple paragraphs separated by blank lines", () => {
    render(<MessageContent content={"paragraph one\n\nparagraph two"} />);
    expect(screen.getByText("paragraph one")).toBeInTheDocument();
    expect(screen.getByText("paragraph two")).toBeInTheDocument();
    const paragraphs = document.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
  });
});

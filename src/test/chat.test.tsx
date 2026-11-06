import { StrictMode, type ComponentType } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { callAI } = vi.hoisted(() => ({ callAI: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => callAI }));
vi.mock("@/lib/ai.functions", () => ({ runAI: vi.fn() }));

import { Route } from "@/routes/chat";

describe("Chat effect lifecycle", () => {
  afterEach(() => vi.restoreAllMocks());

  it("sends messages and unmounts without treating scrolling as an effect cleanup", async () => {
    // A non-function return catches an accidental implicit effect return.
    const scroll = vi.fn(() => "not a cleanup function");
    const previous = Object.getOwnPropertyDescriptor(Element.prototype, "scrollIntoView");
    Object.defineProperty(Element.prototype, "scrollIntoView", { configurable: true, value: scroll });
    callAI.mockResolvedValue({ text: "Assign each action item an owner and deadline." });
    const Chat = Route.options.component as ComponentType;

    try {
      const view = render(<StrictMode><Chat /></StrictMode>);
      const input = screen.getByPlaceholderText("Type your message…");
      fireEvent.change(input, { target: { value: "How can I improve team meetings?" } });
      fireEvent.click(screen.getByRole("button", { name: /^Send$/ }));
      await screen.findByText("Assign each action item an owner and deadline.");
      expect(callAI).toHaveBeenCalledWith({
        data: {
          instructions: "ROLE: Friendly, expert workplace assistant. Answer helpfully and concisely.",
          messages: [{ role: "user", content: "How can I improve team meetings?" }],
        },
      });
      await waitFor(() => expect(scroll).toHaveBeenCalled());
      fireEvent.click(screen.getByRole("button", { name: /^Clear$/ }));
      expect(screen.queryByText("Assign each action item an owner and deadline.")).toBeNull();
      expect(() => view.unmount()).not.toThrow();
    } finally {
      if (previous) Object.defineProperty(Element.prototype, "scrollIntoView", previous);
      else Reflect.deleteProperty(Element.prototype, "scrollIntoView");
    }
  });
});
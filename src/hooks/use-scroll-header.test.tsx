import { act, renderHook, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollHeader } from "./use-scroll-header";

function scrollTo(y: number) {
  act(() => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: y });
    window.dispatchEvent(new Event("scroll"));
  });
}

beforeEach(() => {
  Object.defineProperty(document.documentElement, "scrollHeight", { configurable: true, value: 5000 });
  Object.defineProperty(window, "innerHeight", { configurable: true, value: 900 });
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
});

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Header scroll behavior", () => {
  it("keeps both bars visible at the top", () => {
    const { result } = renderHook(useScrollHeader);
    expect(result.current).toEqual({ hidden: false, scrolled: false });
    scrollTo(400);
    expect(result.current.hidden).toBe(true);
    scrollTo(0);
    expect(result.current).toEqual({ hidden: false, scrolled: false });
  });

  it("hides after eight pixels scrolling down", () => {
    const { result } = renderHook(useScrollHeader);
    scrollTo(7);
    expect(result.current.hidden).toBe(false);
    scrollTo(8);
    expect(result.current).toEqual({ hidden: true, scrolled: true });
  });

  it("reveals after eight pixels scrolling up far from the top", () => {
    const { result } = renderHook(useScrollHeader);
    scrollTo(1800);
    expect(result.current.hidden).toBe(true);
    scrollTo(1793);
    expect(result.current.hidden).toBe(true);
    scrollTo(1792);
    expect(result.current).toEqual({ hidden: false, scrolled: true });
  });

  it("accumulates small movements but ignores direction jitter", () => {
    const { result } = renderHook(useScrollHeader);
    scrollTo(3);
    scrollTo(1);
    scrollTo(4);
    scrollTo(6);
    expect(result.current.hidden).toBe(false);
    scrollTo(9);
    expect(result.current.hidden).toBe(true);
  });

  it("does not hide on negative overscroll at the top", () => {
    const { result } = renderHook(useScrollHeader);
    scrollTo(-30);
    scrollTo(0);
    expect(result.current).toEqual({ hidden: false, scrolled: false });
  });

  it("removes the scroll listener when unmounted", () => {
    const removeListener = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(useScrollHeader);
    unmount();
    expect(removeListener).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
  localStorage.clear();
});

function mountAt(path: string) {
  window.history.replaceState({}, "", path);
  return render(
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </BrowserRouter>,
  );
}

describe("SIGAP routes", () => {
  it.each([
    ["/pantau", "Pantau"],
    ["/peta", "Peta & Titik Api"],
    ["/rencana", "Rencana Aman"],
    ["/sigap-ai", "SIGAP AI"],
    ["/darurat", "Mode Siaga"],
    ["/panduan-darurat", "Panduan Darurat"],
    ["/preview", "Pratinjau layar"],
  ])("opens %s directly", (path, heading) => {
    mountAt(path);
    expect(
      screen.getByRole("heading", { level: 1, name: heading }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe(path);
  });
  it("redirects the root route to the home screen", async () => {
    mountAt("/");
    await waitFor(() => expect(window.location.pathname).toBe("/pantau"));
    expect(
      screen.getByRole("heading", { level: 1, name: "Pantau" }),
    ).toBeInTheDocument();
  });
  it("redirects unknown routes to the home screen", async () => {
    mountAt("/route-tidak-ada");
    await waitFor(() => expect(window.location.pathname).toBe("/pantau"));
  });
});

describe("core interactions", () => {
  it("navigates through bottom navigation", async () => {
    mountAt("/pantau");
    fireEvent.click(screen.getAllByRole("link", { name: /Peta/i })[0]);
    await waitFor(() =>
      expect(screen.getByText("Peta indikasi titik panas")).toBeInTheDocument(),
    );
  });
  it("filters hotspot indications", () => {
    mountAt("/peta");
    fireEvent.change(screen.getByLabelText("Filter indikasi"), {
      target: { value: "Sedang" },
    });
    expect(
      screen.getByRole("button", { name: "Pilih indikasi Kampar" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Pilih indikasi Pelalawan" }),
    ).not.toBeInTheDocument();
  });
  it("zooms the map and shows reporting feedback", () => {
    const { container } = mountAt("/peta");
    fireEvent.click(screen.getByRole("button", { name: "Perbesar peta" }));
    expect(container.querySelector(".map-grid")).toHaveStyle({
      transform: "scale(1.1)",
    });
    fireEvent.click(screen.getByRole("button", { name: /Laporkan indikasi/ }));
    expect(screen.getByRole("status")).toHaveTextContent(
      /belum terhubung ke kanal resmi/,
    );
  });
  it("changes the selected hotspot details", () => {
    mountAt("/peta");
    fireEvent.click(
      screen.getByRole("button", { name: "Pilih indikasi Kampar" }),
    );
    expect(screen.getByRole("heading", { name: /Kampar/ })).toBeInTheDocument();
    expect(screen.getByText("35 km")).toBeInTheDocument();
  });
  it("persists the selected location preference", () => {
    mountAt("/pantau");
    fireEvent.change(screen.getByLabelText("Pilih lokasi"), {
      target: { value: "Dumai, Riau" },
    });
    expect(localStorage.getItem("sigap-location")).toBe("Dumai, Riau");
    expect(screen.getByText("112")).toBeInTheDocument();
  });
  it("changes the selected forecast day", () => {
    mountAt("/rencana");
    fireEvent.click(screen.getByRole("button", { name: /Rab 26/ }));
    expect(screen.getByText(/RINGKASAN RAB/)).toBeInTheDocument();
  });
  it("returns a local assistant response", async () => {
    mountAt("/sigap-ai");
    fireEvent.change(screen.getByLabelText("Tulis pertanyaan"), {
      target: { value: "Apa arti AQI 168?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Kirim pesan" }));
    await waitFor(() =>
      expect(screen.getByText(/Batasi aktivitas berat/i)).toBeInTheDocument(),
    );
  });
  it("keeps chat submission disabled for an empty form", () => {
    mountAt("/sigap-ai");
    expect(screen.getByRole("button", { name: "Kirim pesan" })).toBeDisabled();
  });
  it("pauses and resumes the local countdown", () => {
    mountAt("/darurat");
    fireEvent.click(screen.getByRole("button", { name: /Jeda/i }));
    expect(
      screen.getByRole("button", { name: /Lanjutkan/i }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Lanjutkan/i }));
    expect(screen.getByRole("button", { name: /Jeda/i })).toBeInTheDocument();
  });
  it("records the emergency acknowledgement for the session", () => {
    mountAt("/darurat");
    fireEvent.click(screen.getByRole("button", { name: "Saya aman" }));
    expect(
      screen.getByText(/Status aman dicatat di sesi ini/),
    ).toBeInTheDocument();
  });
  it("marks the user safe on the guidance screen", () => {
    mountAt("/panduan-darurat");
    fireEvent.click(screen.getByRole("button", { name: /Saya sudah aman/ }));
    expect(screen.getByText("Senang kamu aman")).toBeInTheDocument();
  });
  it("explains that official destinations and contacts are unavailable in demo", () => {
    mountAt("/panduan-darurat");
    fireEvent.click(screen.getByRole("button", { name: /Buka navigasi/ }));
    expect(screen.getByRole("status")).toHaveTextContent(
      /tujuan aman belum tersedia/,
    );
    fireEvent.click(screen.getByRole("button", { name: /Kontak darurat/ }));
    expect(screen.getByRole("status")).toHaveTextContent(
      /Nomor kontak resmi tidak disediakan/,
    );
  });
});

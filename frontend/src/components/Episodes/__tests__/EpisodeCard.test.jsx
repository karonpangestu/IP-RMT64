import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import EpisodeCard from "../EpisodeCard"

const mockEpisode = {
  id: "1",
  title: "Test Episode",
  status: "completed",
}

describe("EpisodeCard", () => {
  it("renders episode information correctly", () => {
    render(
      <BrowserRouter>
        <EpisodeCard episode={mockEpisode} />
      </BrowserRouter>
    )

    expect(screen.getByText("Test Episode")).toBeInTheDocument()
    expect(screen.getByText("Status: completed")).toBeInTheDocument()
    expect(screen.getByText("View Details")).toBeInTheDocument()
  })
})

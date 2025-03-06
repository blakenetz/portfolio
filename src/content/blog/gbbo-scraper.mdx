---
title: "GBBO Scraper"
description: "Python + Next.js scraper of the Great British Bake Off"
pubDate: "Dec 16, 2024"
link:
  type: "github"
  url: "https://github.com/blakenetz/gbbo-api"
---

# The Great British Scrape Off

During my funemployment stint, I became inspired by the Great British Bake Off
and picked up baking. During this GBBO frenzy, I discovered how adorable, yet
impractical their website was, so felt a _knead_ to recreate it! I'll outline
some of the juicy bits here, but the finished results can be viewed at:

- [Deployed site](https://frontend-production-9bf8.up.railway.app/)
- [GitHub repo](https://github.com/blakenetz/gbbo-api)

For those who want to follow along, the project is [Turbo](https://turbo.build/)
monorepo with 3 packages:

1.  **scraper**: python script
2.  **api**: [FastAPI](https://fastapi.tiangolo.com/) app
3.  **frontend**: [Next.js](https://nextjs.org/) app

_Fun fact: it was initially setup as a straight-forward python app, but I used
the [Cursor IDE](https://cursor.com/) `compose` feature to completely refactor
it, which was 🤯_

## The Scraper

On your marks... get set... scrape!

The project uses `recipes` as the core data model with an series of
complementary models represented as one-to-many and many-to-many tables (i.e.
`bakers`, `diets`, `categories`, and `bake_types`). Luckily enough, all of the
data for the models can be extracted from a
[single view](https://thegreatbritishbakeoff.co.uk/recipes/all). Since the steps
were essentially the same for each model, I thought the best approach was to
make a main `WebScraper` class that each model could inherit from.

### The Scrape Steps

`WebScraper` goes to a page, finds the nodes that hold the information, extract
meaningful data from each node, and then saves to the DB. To support pagination,
there's also a while-loop that will run, at most, 100 cycles.

```python
import requests
from bs4 import BeautifulSoup, PageElement, ResultSet
import time
import sqlite3
from typing import List

class WebScraper:
  def __init__(self, max_page: int = 100):
    # Config DB connection
    self.connection = sqlite3.connect("gbbo.db")
    self.sql = self.connection.cursor()

    self.base_url = "https://thegreatbritishbakeoff.co.uk/recipes/all/"
    self.card_selector = "" # a query selector for each node that holds relevant data
    self.max_page = max_page # this is just a failsafe to make sure the script doesn't run forever

  def _generate_page_url(self, page_number: int) -> str:
    return self.base_url

  def _get_soup(self, url: str) -> BeautifulSoup:
    page = requests.get(url)
    soup = BeautifulSoup(page.content, "html.parser")
    return soup

  def _scrape_page(self, url: str, page: int) -> List[dict]:
    soup = self._get_soup(url)
    cards = soup.find_all(class_=self.card_selector)
    return self._extract_items(cards, page)

  def _extract_items(self, cards: ResultSet[PageElement], page: int) -> List[dict]:
    return []

  def _save_to_db(self, results: List[dict]) -> None:
    return

  def scrape(self) -> None:
    page = 1

    while True:
      url = self._generate_page_url(page)
      results = self._scrape_page(url, page)
      count = len(results)

      if count == 0:
        break

      self._save_to_db(results)

      if page >= self.max_page:
        break

      page += 1
      # we want 4 rps
      time.sleep(.25)

    self.connection.close()
```

Each instance of `WebScraper` would just need to override `_generate_page_url`,
`_extract_items`, and `_save_to_db`. Alternatively, I could have passed those as
arguments, but just found this solution easier to read and the scraper-to-model
contract was more apparent.

## API

The API is a fairly cut and dry FastAPI app. Each file has a distinct
responsibility (`models`, `routes`, `services`, etc.) and within each file,
there isn't much magic. `models` is a direct one-to-one of the sql statements we
saw in the
[startup script](https://github.com/blakenetz/gbbo-api/blob/fab1380ce42809f973dea0229d0fc110a1884693/packages/scraper/db-setup.py).
`routes` is as dumb as dumb gets. It has 2 jobs: defined the API and call a
service. `services` generates and executes a sql statement, then returns an HTTP
response or exception.

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine
from routes import recipe_router, diet_router, baker_router, category_router, bake_type_router

sqlite_url = "sqlite:///gbbo.db"
connect_args = {"check_same_thread": False}

engine = create_engine(sqlite_url, connect_args=connect_args)

# DB helper functions and types
def create_db_and_tables():
  SQLModel.metadata.create_all(engine)

# FastAPI Setup
app = FastAPI(
  title="GBBO Recipe API",
  description="Unofficial API for Great British Bake Off Recipes",
  version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(recipe_router, prefix='/recipe', tags=['recipe'])
app.include_router(baker_router, prefix="/baker", tags=['baker'])
# ...

@app.on_event("startup")
def on_startup():
  create_db_and_tables()

# Run application
if __name__ == "__main__":
  uvicorn.run(app, host="0.0.0.0", port=8000)
```

```python
# routes.py
from fastapi import APIRouter
from sqlmodel import Session
from services import RecipeService, GenericService
from models import Diet

recipe_router = APIRouter()
diet_router = APIRouter()
# etc.

@recipe_router.get("/")
def get_recipes(
  session: SessionDep,
  limit: Optional[int] = 50,
  skip: Optional[int] = 0,
  q: Annotated[Optional[str], Query(description="Case insensitive search against recipe title")] = None,
  difficulty: Annotated[Optional[int], Query(le=3, ge=1, description="Difficulty on a 1-3 scale")] = None,
  time: Annotated[Optional[int], Query(description="Max time in minutes")] = None,
  baker_ids: Annotated[list[int], Query(description="List of baker ids. Available at GET /bakers")] = None,
  diet_ids: Annotated[list[int], Query(description="List of diet ids. Available at GET /diets")] = None,
  category_ids: Annotated[list[int], Query(description="List of category ids. Available at GET /categories")] = None,
  bake_type_ids: Annotated[list[int], Query(description="List of bake type ids. Available at GET /bake_types")] = None,
):
  return RecipeService.get_recipes(
    session, limit, skip, q, difficulty,
     time, baker_ids, diet_ids,
    category_ids, bake_type_ids
  )

@diet_router.get("/{diet_id}")
def get_recipe_by_id(session: SessionDep, diet_id: int):
  # since all the complementary models have the same shape,
  # we can utilize a generic service here and just pass the model in as an arg
  return GenericService.get_item(Diet, session, diet_id)

# and so on, and so forth
```

```python
# services.py
from typing import List, Optional
from fastapi import HTTPException
from sqlmodel import Session, select
from sqlmodel.sql.expression import SelectOfScalar
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from models import BakeType, Baker, Category, Diet, Recipe, RecipeBakeType, RecipeCategory, RecipeDiet, RecipeResponse

class RecipeService:
  def _get_root_statement() -> SelectOfScalar[Recipe]:
    return (
      select(Recipe)
      .options(
        # avoid the N+1 problem by utilizing selectinload
        selectinload(Recipe.baker),
        selectinload(Recipe.diets),
        selectinload(Recipe.categories),
        selectinload(Recipe.bake_types)
      )
    )

  def _apply_filters(
    statement: SelectOfScalar[Recipe],
    q: Optional[str] = None,
    difficulty: Optional[int] = None,
    time: Optional[int] = None,
    baker_ids: Optional[List[int]] = None,
    diet_ids: Optional[List[int]] = None,
    category_ids: Optional[List[int]] = None,
    bake_type_ids: Optional[List[int]] = None
  ) -> SelectOfScalar[Recipe]:
    # define sql statements for each arg
    filters = [
      (q, lambda s: s.where(Recipe.title.contains(q))),
      (difficulty, lambda s: s.where(Recipe.difficulty == difficulty)),
      (time, lambda s: s.where(Recipe.time <= time)),
      (baker_ids, lambda s: s.where(Recipe.baker_id.in_(baker_ids))),
      (diet_ids, lambda s: s.where(RecipeDiet.diet_id.in_(diet_ids))),
      (category_ids, lambda s: s.where(RecipeCategory.category_id.in_(category_ids))),
      (bake_type_ids, lambda s: s.where(RecipeBakeType.bake_type_id.in_(bake_type_ids))),
    ]

    for condition, filter in filters:
      if condition:
        statement = filter(statement)

    # Special handling for join tables
    if diet_ids:
      statement = (
        statement
        .join(RecipeDiet, RecipeDiet.recipe_id == Recipe.id)
        .where(RecipeDiet.diet_id.in_(diet_ids))
        .distinct()
      )
    # repeat for other join tables

    return statement

  @classmethod
  def get_recipes(
    self,
    session: Session,
    # ...shortened for brevity
  ) -> List[dict]:
    statement = self._get_root_statement()
    # apply pagination
    statement = statement.offset(skip).limit(limit)
    # apply filters
    statement = self._apply_filters(statement, q, difficulty, time, baker_ids, diet_ids, category_ids, bake_type_ids)

    results = session.exec(statement).all()

    if not results:
      raise HTTPException(status_code=404, detail="No recipes found")

    return results

# ...yada yada yada
```

## Frontend

Because I have an API app and not a server, I though we could could roll a
two-bird solution and use Next.js. Again, this is more `cake` and less `gateau`,
but there is still a couple of pointer-outers:

I opted for the
[useActionState](https://react.dev/reference/react/useActionState) hook in the
initial view to gracefully handle slow-connectivity. The root `page` file is
[RSC](https://react.dev/reference/rsc/server-components): it's an async function
that will render a single time on the server, then flown over to the client. The
body of the return statement has a single slot represented as a `<Form />`
element that will be rehydrated once it hits the client. The Form element
executers a
[server action](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
on submit. We're invoking the server action through the action state hook
because it provides a nice `isPending` state to let us know that the async
function hasn't resolved yet.

```tsx
"use client";
import { Loader, TextInput } from "@mantine/core";
import { useActionState } from "react";

async function handleSubmit(_state: null, formData: FormData) {
  "use server";
  const query = formData.get("q") as string;
  if (query.length > 0) {
    redirect(`/search?q=${query}`);
  }
  return null;
}

export default function FormClient() {
  // `TextInput` is uncontrolled and the server action redirects on success,
  // so there wasn't much value in saving the form state
  const [_state, formAction, isPending] = useActionState(handleSubmit, null);

  return (
    <form action={formAction}>
      <TextInput
        placeholder="Search for a recipe"
        name="q"
        disabled={isPending}
        rightSection={isPending ? <Loader size="xs" /> : null}
      />
    </form>
  );
}
```

There's also a simple Next.js cache layer on all outbound server requests. The
[Next.js fetch](https://nextjs.org/docs/app/api-reference/functions/fetch)
module provides an easy way to config the
[Next.js Data Cache](https://nextjs.org/docs/app/building-your-application/caching#data-cache).
In my case, I wanted to aggressively cache all request for an hour:

```tsx
const cacheConfig: RequestInit = {
  cache: "force-cache",
  next: {
    revalidate: 60 * 60, // 1 hour
  },
};

export async function fetchResource() {
  const res = fetch(API_URL, cacheConfig);
  return res.json();
}
```

And finally, the `/search` route contains a form to filter out recipes. I
thought it'd be nice to submit said form every time there's a state change.
Since the filters are primarily checkboxes and dropdowns, there isn't much
concern of causing a network traffic jam. With that said, there is a single text
input that I needed to handle. I wanted to keep the form uncontrolled, so I
applied form-level change handler and conditionally debounced the network
requests:

```tsx
import { debounce } from "lodash";
import Form from "next/form";
import { submitFilters } from "./actions";

const debouncedSubmit = debounce(submitFilters, 1000);

export default async function Filters({
  searchParams,
}: Promise<Record<string, string>>) {
  const params = await searchParams;

  const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    debouncedSubmit.flush(); // flush the debounced state
    const formData = new FormData(e.currentTarget);

    if (e.target instanceof HTMLInputElement && e.target.name === "q") {
      debouncedSubmit(formData);
    } else {
      submitFilters(formData);
    }
  };

  return (
    <Form action={submitFilters} onChange={handleChange}>
      <TextInput
        name="q"
        label="Recipe name"
        defaultValue={params.get("q") ?? ""}
      />

      <Multiselect
        data={bakersWithIcons}
        name="bakers"
        defaultValues={params.get("baker_ids")?.split(",") ?? []}
      />

      <Select
        defaultValue={params.get("difficulty") ?? ""}
        label="Difficulty"
        name="difficulty"
        placeholder="Select difficulty"
        data={[
          { value: "1", label: "Easy" },
          { value: "2", label: "Medium" },
          { value: "3", label: "Hard" },
        ]}
        clearable
      />

      {/** etc.*/}
    </Form>
  );
}
```

Well that was fun! Let me know what you think and, more importantly, what you're
baking 🎂

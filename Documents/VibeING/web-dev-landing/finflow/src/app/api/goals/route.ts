import { NextResponse } from "next/server";

// DEMO: это pet-project — API-роуты используют in-memory данные (сбрасываются при перезапуске).
// Фронтенд работает напрямую с localStorage, эти роуты — заглушки для будущего бэкенда.
const MOCK_GOALS = [
  { id: "1", name: "Отпуск в Турции", target: 150000, current: 98000, deadline: "2026-06-01", color: "#34d399" },
  { id: "2", name: "Новый MacBook", target: 250000, current: 180000, deadline: "2026-03-15", color: "#60a5fa" },
  { id: "3", name: "Подушка безопасности", target: 500000, current: 230000, deadline: "2026-12-31", color: "#a78bfa" },
];

let goals = [...MOCK_GOALS];
let nextId = 4;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const goal = goals.find((g) => g.id === id);
    if (!goal) return NextResponse.json({ error: "Цель не найдена" }, { status: 404 });
    return NextResponse.json(goal);
  }

  return NextResponse.json(goals);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, target, deadline, current = 0, color = "#a78bfa" } = body;

    if (!name || !target || !deadline) {
      return NextResponse.json({ error: "Необходимо: name, target, deadline" }, { status: 400 });
    }

    const newGoal = {
      id: String(nextId++),
      name,
      target: Number(target),
      current: Number(current) || 0,
      deadline,
      color,
    };

    goals.push(newGoal);
    return NextResponse.json(newGoal, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Неверный формат данных" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Необходим параметр id" }, { status: 400 });

    const body = await request.json();
    const goalIndex = goals.findIndex((g) => g.id === id);
    if (goalIndex === -1) return NextResponse.json({ error: "Цель не найдена" }, { status: 404 });

    if (body.currentIncrement !== undefined) {
      const increment = Number(body.currentIncrement) || 0;
      goals[goalIndex] = {
        ...goals[goalIndex],
        current: Math.min(goals[goalIndex].current + increment, goals[goalIndex].target),
      };
    }

    if (body.name !== undefined) goals[goalIndex].name = body.name;
    if (body.target !== undefined) goals[goalIndex].target = Number(body.target);
    if (body.deadline !== undefined) goals[goalIndex].deadline = body.deadline;

    return NextResponse.json(goals[goalIndex]);
  } catch {
    return NextResponse.json({ error: "Неверный формат данных" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Необходим параметр id" }, { status: 400 });

  const index = goals.findIndex((g) => g.id === id);
  if (index === -1) return NextResponse.json({ error: "Цель не найдена" }, { status: 404 });

  goals.splice(index, 1);
  return NextResponse.json({ success: true });
}

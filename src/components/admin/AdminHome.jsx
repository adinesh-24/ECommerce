import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as d3 from "d3";

const STATUS_COLORS = {
    pending: "#f59e0b",
    approved: "#10b981",
    processing: "#3b82f6",
    shipped: "#8b5cf6",
    delivered: "#06b6d4",
};

// ── derive analytics from raw orders array ──────────────────
function deriveAnalytics(orders) {
    // 1. Orders by status
    const statusMap = {};
    orders.forEach(o => {
        statusMap[o.status] = (statusMap[o.status] || 0) + 1;
    });
    const byStatus = Object.entries(statusMap).map(([_id, count]) => ({ _id, count }));

    // 2. Daily revenue — last 30 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const dayMap = {};
    orders
        .filter(o => new Date(o.createdAt) >= cutoff)
        .forEach(o => {
            const day = o.createdAt.slice(0, 10);
            if (!dayMap[day]) dayMap[day] = { revenue: 0, orderCount: 0 };
            dayMap[day].orderCount += 1;
            o.products.forEach(item => {
                dayMap[day].revenue += (item.productId?.price || 0) * (item.quantity || 1);
            });
        });
    const dailyRevenue = Object.entries(dayMap)
        .map(([date, v]) => ({ date, ...v }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // 3. Top 5 products by qty
    const qtyMap = {};
    orders.forEach(o => {
        o.products.forEach(item => {
            const name = item.productId?.name || item.productId?.title || "Unknown";
            qtyMap[name] = (qtyMap[name] || 0) + (item.quantity || 1);
        });
    });
    const topProducts = Object.entries(qtyMap)
        .map(([name, totalQty]) => ({ name, totalQty }))
        .sort((a, b) => b.totalQty - a.totalQty)
        .slice(0, 5);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;

    return { byStatus, dailyRevenue, topProducts, summary: { totalOrders, pendingOrders } };
}

// ── Stat Card ────────────────────────────────────────────────
function StatCard({ label, value, icon, gradient }) {
    return (
        <div className="col-6 col-xl-3">
            <div className="rounded-4 p-4 text-white d-flex align-items-center gap-3 shadow"
                style={{ background: gradient }}>
                <div style={{ fontSize: 36 }}>{icon}</div>
                <div>
                    <div className="fw-bold" style={{ fontSize: 26 }}>{value}</div>
                    <div className="small opacity-75">{label}</div>
                </div>
            </div>
        </div>
    );
}

// ── Donut Chart — Orders by Status ───────────────────────────
function DonutChart({ data }) {
    const ref = useRef();
    useEffect(() => {
        if (!data?.length) return;
        const el = d3.select(ref.current);
        el.selectAll("*").remove();
        const W = ref.current.clientWidth || 280, H = 240;
        const R = Math.min(W, H) / 2 - 20;
        const svg = el.append("svg").attr("width", W).attr("height", H)
            .append("g").attr("transform", `translate(${W / 2},${H / 2})`);
        const pie = d3.pie().value(d => d.count).sort(null);
        const arc = d3.arc().innerRadius(R * 0.55).outerRadius(R);
        const arcH = d3.arc().innerRadius(R * 0.52).outerRadius(R + 8);
        svg.selectAll("path").data(pie(data)).enter().append("path")
            .attr("d", arc)
            .attr("fill", d => STATUS_COLORS[d.data._id] || "#94a3b8")
            .attr("stroke", "#fff").attr("stroke-width", 2).style("cursor", "pointer")
            .on("mouseover", function (e, d) { d3.select(this).transition().duration(120).attr("d", arcH(d)); })
            .on("mouseout", function (e, d) { d3.select(this).transition().duration(120).attr("d", arc(d)); });
        const total = d3.sum(data, d => d.count);
        svg.append("text").attr("text-anchor", "middle").attr("dy", "-0.1em")
            .style("font-size", "22px").style("font-weight", "700").style("fill", "#1e293b").text(total);
        svg.append("text").attr("text-anchor", "middle").attr("dy", "1.3em")
            .style("font-size", "11px").style("fill", "#64748b").text("Total Orders");
    }, [data]);
    return (
        <div>
            <div ref={ref} style={{ width: "100%" }} />
            <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
                {data.map(d => (
                    <span key={d._id} className="badge rounded-pill px-3 py-2"
                        style={{ background: STATUS_COLORS[d._id] || "#94a3b8", fontSize: 11 }}>
                        {d._id} · {d.count}
                    </span>
                ))}
            </div>
        </div>
    );
}

// ── Bar Chart — Daily Revenue ─────────────────────────────────
function RevenueBarChart({ data }) {
    const ref = useRef();
    useEffect(() => {
        if (!data?.length) return;
        const el = d3.select(ref.current);
        el.selectAll("*").remove();
        const m = { top: 12, right: 12, bottom: 54, left: 64 };
        const W = ref.current.clientWidth || 480, H = 230;
        const iW = W - m.left - m.right, iH = H - m.top - m.bottom;
        const svg = el.append("svg").attr("width", W).attr("height", H)
            .append("g").attr("transform", `translate(${m.left},${m.top})`);
        const x = d3.scaleBand().domain(data.map(d => d.date)).range([0, iW]).padding(0.3);
        const y = d3.scaleLinear().domain([0, d3.max(data, d => d.revenue) * 1.15 || 100]).range([iH, 0]);
        svg.append("g").call(d3.axisLeft(y).tickSize(-iW).ticks(4).tickFormat(""))
            .call(g => { g.selectAll("line").attr("stroke", "#e2e8f0").attr("stroke-dasharray", "3,3"); g.select(".domain").remove(); });
        svg.append("g").attr("transform", `translate(0,${iH})`)
            .call(d3.axisBottom(x).tickValues(x.domain().filter((_, i) => i % Math.ceil(data.length / 7) === 0)))
            .call(g => {
                g.selectAll("text").attr("transform", "rotate(-38)").attr("text-anchor", "end").style("font-size", "10px").style("fill", "#64748b");
                g.select(".domain").attr("stroke", "#e2e8f0"); g.selectAll(".tick line").remove();
            });
        svg.append("g").call(d3.axisLeft(y).ticks(4).tickFormat(d => `₹${d3.format(".2s")(d)}`))
            .call(g => { g.selectAll("text").style("font-size", "10px").style("fill", "#64748b"); g.select(".domain").remove(); g.selectAll(".tick line").remove(); });
        const defs = el.select("svg").append("defs");
        const grad = defs.append("linearGradient").attr("id", "rg").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 1);
        grad.append("stop").attr("offset", "0%").attr("stop-color", "#6366f1");
        grad.append("stop").attr("offset", "100%").attr("stop-color", "#a5b4fc");
        svg.selectAll(".bar").data(data).enter().append("rect")
            .attr("x", d => x(d.date)).attr("width", x.bandwidth())
            .attr("y", iH).attr("height", 0).attr("rx", 4).attr("fill", "url(#rg)")
            .transition().duration(600).delay((_, i) => i * 25)
            .attr("y", d => y(d.revenue)).attr("height", d => iH - y(d.revenue));
    }, [data]);
    return <div ref={ref} style={{ width: "100%" }} />;
}

// ── Horizontal Bar — Top Products ────────────────────────────
function TopProductsChart({ data }) {
    const ref = useRef();
    useEffect(() => {
        if (!data?.length) return;
        const el = d3.select(ref.current);
        el.selectAll("*").remove();
        const m = { top: 8, right: 50, bottom: 8, left: 130 };
        const W = ref.current.clientWidth || 400;
        const H = data.length * 46 + m.top + m.bottom;
        const iW = W - m.left - m.right, iH = H - m.top - m.bottom;
        const svg = el.append("svg").attr("width", W).attr("height", H)
            .append("g").attr("transform", `translate(${m.left},${m.top})`);
        const y = d3.scaleBand().domain(data.map(d => d.name)).range([0, iH]).padding(0.35);
        const x = d3.scaleLinear().domain([0, d3.max(data, d => d.totalQty) * 1.2 || 10]).range([0, iW]);
        const colors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];
        svg.selectAll(".lbl").data(data).enter().append("text")
            .attr("x", -8).attr("y", d => y(d.name) + y.bandwidth() / 2).attr("dy", "0.35em")
            .attr("text-anchor", "end").style("font-size", "12px").style("fill", "#334155")
            .text(d => d.name.length > 16 ? d.name.slice(0, 15) + "…" : d.name);
        svg.selectAll(".hbar").data(data).enter().append("rect")
            .attr("y", d => y(d.name)).attr("height", y.bandwidth())
            .attr("x", 0).attr("width", 0).attr("rx", 4)
            .attr("fill", (_, i) => colors[i % colors.length])
            .transition().duration(700).delay((_, i) => i * 80).attr("width", d => x(d.totalQty));
        svg.selectAll(".val").data(data).enter().append("text")
            .attr("x", d => x(d.totalQty) + 6).attr("y", d => y(d.name) + y.bandwidth() / 2)
            .attr("dy", "0.35em").style("font-size", "11px").style("fill", "#64748b").style("opacity", 0)
            .text(d => `${d.totalQty} units`)
            .transition().delay((_, i) => 700 + i * 80).style("opacity", 1);
    }, [data]);
    return <div ref={ref} style={{ width: "100%" }} />;
}

// ── Main Dashboard ───────────────────────────────────────────
export default function AdminHome() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        // Use existing GET /order route (returns all orders for admin)
        axios.get(`${import.meta.env.VITE_API_URL}/order`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setAnalytics(deriveAnalytics(res.data)))
            .catch(err => setError(err.response?.data?.message || "Failed to load orders"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
            <div className="spinner-border text-primary" role="status" />
        </div>
    );
    if (error) return (
        <div className="container mt-5"><div className="alert alert-danger">⚠ {error}</div></div>
    );

    const { byStatus, dailyRevenue, topProducts, summary } = analytics;
    const totalRevenue = dailyRevenue.reduce((s, d) => s + d.revenue, 0);

    return (
        <div className="container-fluid py-4 px-4" style={{ background: "#f1f5f9", minHeight: "100vh" }}>

            <div className="mb-4">
                <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>📊 Dashboard</h2>
                <p className="text-muted small mb-0">Live analytics for your store</p>
            </div>

            {/* Stat Cards */}
            <div className="row g-3 mb-4">
                <StatCard label="Total Orders" value={summary.totalOrders} icon="🛒" gradient="linear-gradient(135deg,#6366f1,#818cf8)" />
                <StatCard label="Pending" value={summary.pendingOrders} icon="⏳" gradient="linear-gradient(135deg,#f59e0b,#fbbf24)" />
                <StatCard label="Revenue (30d)" value={`₹${Math.round(totalRevenue).toLocaleString()}`} icon="💰" gradient="linear-gradient(135deg,#10b981,#34d399)" />
                <StatCard label="Active Days" value={dailyRevenue.length} icon="📅" gradient="linear-gradient(135deg,#06b6d4,#22d3ee)" />
            </div>

            {/* Row 1 */}
            <div className="row g-4 mb-4">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <p className="text-uppercase fw-bold mb-3" style={{ fontSize: 11, letterSpacing: 1, color: "#64748b" }}>Orders by Status</p>
                            {byStatus.length ? <DonutChart data={byStatus} /> : <p className="text-muted text-center py-4">No data yet</p>}
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="text-uppercase fw-bold mb-0" style={{ fontSize: 11, letterSpacing: 1, color: "#64748b" }}>Daily Revenue — Last 30 Days</p>
                                <span className="badge bg-primary rounded-pill">₹{Math.round(totalRevenue).toLocaleString()} total</span>
                            </div>
                            {dailyRevenue.length ? <RevenueBarChart data={dailyRevenue} /> : <p className="text-muted text-center py-4">No revenue in last 30 days</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2 */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <p className="text-uppercase fw-bold mb-3" style={{ fontSize: 11, letterSpacing: 1, color: "#64748b" }}>Top 5 Products by Quantity Sold</p>
                            {topProducts.length ? <TopProductsChart data={topProducts} /> : <p className="text-muted text-center py-4">No sales yet</p>}
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4">
                            <p className="text-uppercase fw-bold mb-3" style={{ fontSize: 11, letterSpacing: 1, color: "#64748b" }}>Status Breakdown</p>
                            <table className="table table-sm align-middle mb-0">
                                <thead className="table-light">
                                    <tr><th>Status</th><th className="text-end">Count</th><th>Share</th></tr>
                                </thead>
                                <tbody>
                                    {byStatus.map(s => {
                                        const pct = summary.totalOrders ? Math.round((s.count / summary.totalOrders) * 100) : 0;
                                        return (
                                            <tr key={s._id}>
                                                <td><span className="badge rounded-pill px-3" style={{ background: STATUS_COLORS[s._id] || "#94a3b8" }}>{s._id}</span></td>
                                                <td className="text-end fw-bold">{s.count}</td>
                                                <td style={{ minWidth: 110 }}>
                                                    <div className="progress mb-1" style={{ height: 7 }}>
                                                        <div className="progress-bar" style={{ width: `${pct}%`, background: STATUS_COLORS[s._id] || "#94a3b8", transition: "width 0.8s" }} />
                                                    </div>
                                                    <small className="text-muted">{pct}%</small>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

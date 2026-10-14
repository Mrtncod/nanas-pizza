import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { CheckCircle2, ChefHat, Clock, ReceiptText, Truck } from "lucide-react";
import { supabase } from "../../services/supabase";
import { formatCurrency } from "../../utils/helpers";

const orderStages = [
  {
    status: "confirmed",
    label: "Confirmed",
    description: "Order received",
    icon: CheckCircle2,
  },
  {
    status: "preparing",
    label: "Preparing",
    description: "Kitchen is working",
    icon: ChefHat,
  },
  {
    status: "ready",
    label: "Ready",
    description: "Packed and ready",
    icon: ReceiptText,
  },
  {
    status: "out_for_delivery",
    label: "On the way",
    description: "Coming to you",
    icon: Truck,
  },
  {
    status: "delivered",
    label: "Delivered",
    description: "Enjoy your meal!",
    icon: CheckCircle2,
  },
];

function formatStatus(status = "") {
  return status
    .replaceAll("_", " ")
    .replace(/^./, (character) => character.toUpperCase());
}

function OrderConfirmation() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let isActive = true;

    async function loadOrder(isInitialLoad = false) {
      if (isInitialLoad) {
        setIsLoading(true);
        setError("");
      }

      try {
        const orderAccessToken = sessionStorage.getItem(
          `nannas-pizza-order-${orderId}`,
        );

        if (!orderAccessToken) {
          throw new Error(
            "We couldn't verify access to this order. Please use the same browser session you used to place it.",
          );
        }

        const { data, error: requestError } = await supabase.functions.invoke(
          "get-order",
          {
            body: {
              orderId,
              orderAccessToken,
            },
          },
        );

        if (requestError) {
          throw new Error("We couldn't load your order.");
        }

        if (!data?.success || !data.order) {
          throw new Error(data?.error || "We couldn't find this order.");
        }

        if (isActive) {
          setOrder(data.order);
          setLastUpdated(new Date());
          setError("");
        }
      } catch (err) {
        if (isActive && isInitialLoad) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading your order.",
          );
        } else if (isActive) {
          console.error("Could not refresh order status:", err);
        }
      } finally {
        if (isActive && isInitialLoad) {
          setIsLoading(false);
        }
      }
    }

    loadOrder(true);

    const intervalId = setInterval(() => {
      loadOrder();
    }, 10000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-basil-500/20 border-t-basil-500" />

        <p className="mt-4 text-sm text-warm-gray">
          Preparing your order details...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-4 text-center">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-warm-border">
          <h1 className="text-2xl font-bold text-espresso">
            We couldn't load your order
          </h1>

          <p className="mt-3 text-sm leading-6 text-warm-gray">
            {error || "We couldn't find this order."}
          </p>

          <Link
            to="/menu"
            className="mt-6 inline-flex rounded-full bg-basil-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-basil-600"
          >
            Back to menu
          </Link>
        </div>
      </div>
    );
  }

  const currentStageIndex = orderStages.findIndex(
    (stage) => stage.status === order.status,
  );

  const isConfirmed =
    order.paymentStatus === "paid" &&
    [
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "delivered",
    ].includes(order.status);

  const isDelivered = order.status === "delivered";

  return (
    <div className=" mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-8 ">
      {/* ==================== HEADER ==================== */}

      <header className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-basil-500/10">
          <CheckCircle2
            size={32}
            strokeWidth={1.7}
            className="text-basil-600"
          />
        </div>

        <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-basil-600">
          Nanna's Pizza
        </p>

        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-espresso sm:text-3xl lg:text-4xl">
          {isDelivered
            ? "Your order has arrived!"
            : isConfirmed
              ? "Thank you for your order!"
              : "We've received your order"}
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-warm-gray">
          {isDelivered
            ? "We hope you enjoy every bite. Thanks for choosing Nanna's!"
            : "Follow your order's journey below. We'll keep this page updated automatically."}
        </p>

        <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs text-warm-gray ring-1 ring-warm-border/70">
          <span className="h-2 w-2 animate-pulse rounded-full bg-basil-500" />
          Live tracking
          {lastUpdated && (
            <span>
              · Updated{" "}
              {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </header>

      {/* ==================== ORDER TRACKING ==================== */}

      <section className="mt-8 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-warm-border/70 sm:p-7 lg:mt-10 lg:p-8">
        <div className="flex flex-col gap-1 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-basil-600">
            Order progress
          </p>

          <h2 className="text-xl font-extrabold text-espresso sm:text-2xl">
            From our kitchen to your door
          </h2>

          <p className="text-sm text-warm-gray">
            Order status:{" "}
            <span className="font-bold text-basil-600">
              {formatStatus(order.status)}
            </span>
          </p>
        </div>

        {/* Desktop horizontal timeline */}
        <div className="mt-10 hidden lg:block">
          <div className="relative">
            {/* Background line */}
            <div className="absolute left-[10%] right-[10%] top-6 h-1 rounded-full bg-warm-border" />

            {/* Progress line */}
            {currentStageIndex >= 0 && (
              <div
                className="absolute left-[10%] top-6 h-1 rounded-full bg-basil-500 transition-all duration-500"
                style={{
                  width: `${(currentStageIndex / (orderStages.length - 1)) * 80}%`,
                }}
              />
            )}

            <div className="relative grid grid-cols-5">
              {orderStages.map((stage, index) => {
                const StageIcon = stage.icon;

                const isComplete =
                  currentStageIndex >= 0 && index < currentStageIndex;

                const isCurrent = index === currentStageIndex;

                const isUpcoming =
                  currentStageIndex < 0 || index > currentStageIndex;

                return (
                  <div
                    key={stage.status}
                    className="flex flex-col items-center text-center"
                  >
                    <div
                      className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
                        isComplete || isCurrent
                          ? "bg-basil-500 text-white"
                          : "bg-cream text-muted ring-1 ring-warm-border"
                      } ${
                        isCurrent
                          ? "scale-110 shadow-lg ring-4 ring-basil-500/10"
                          : ""
                      }`}
                    >
                      <StageIcon size={20} strokeWidth={2} />
                    </div>

                    <p
                      className={`mt-4 text-sm font-bold ${
                        isUpcoming ? "text-muted" : "text-espresso"
                      }`}
                    >
                      {stage.label}
                    </p>

                    <p
                      className={`mt-1 max-w-[130px] text-xs leading-5 ${
                        isUpcoming ? "text-muted" : "text-warm-gray"
                      }`}
                    >
                      {stage.description}
                    </p>

                    {isCurrent && (
                      <span className="mt-2 rounded-full bg-basil-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-basil-600">
                        Current
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile / tablet vertical timeline */}
        <div className="mt-7 lg:hidden">
          {orderStages.map((stage, index) => {
            const StageIcon = stage.icon;

            const isComplete =
              currentStageIndex >= 0 && index < currentStageIndex;

            const isCurrent = index === currentStageIndex;

            const isUpcoming =
              currentStageIndex < 0 || index > currentStageIndex;

            return (
              <div key={stage.status} className="flex gap-3">
                <div className="flex w-9 shrink-0 flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${
                      isComplete || isCurrent
                        ? "bg-basil-500 text-white"
                        : "bg-cream text-muted ring-1 ring-warm-border"
                    } ${isCurrent ? "ring-4 ring-basil-500/10" : ""}`}
                  >
                    <StageIcon size={17} strokeWidth={2} />
                  </div>

                  {index < orderStages.length - 1 && (
                    <div
                      className={`my-1 min-h-6 w-0.5 flex-1 ${
                        isComplete ? "bg-basil-500" : "bg-warm-border"
                      }`}
                    />
                  )}
                </div>

                <div className="pb-5">
                  <p
                    className={`text-sm font-bold ${
                      isUpcoming ? "text-muted" : "text-espresso"
                    }`}
                  >
                    {stage.label}

                    {isCurrent && (
                      <span className="ml-2 rounded-full bg-basil-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-basil-600">
                        Current
                      </span>
                    )}
                  </p>

                  <p
                    className={`mt-1 text-xs leading-5 ${
                      isUpcoming ? "text-muted" : "text-warm-gray"
                    }`}
                  >
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tracking note */}
        <div className="mt-6 rounded-2xl bg-basil-500/5 p-4">
          <div className="flex items-start gap-3">
            <Clock size={18} className="mt-0.5 shrink-0 text-basil-600" />

            <div>
              <p className="text-sm font-bold text-espresso">
                {isDelivered ? "Order completed" : "We'll keep you updated"}
              </p>

              <p className="mt-1 text-xs leading-5 text-warm-gray">
                {isDelivered
                  ? "Your order is marked as delivered. Enjoy your meal!"
                  : "Keep this page open to follow your order's progress. The status updates automatically."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ORDER SUMMARY ==================== */}

      <section className="mt-5 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-warm-border/70">
        <div className="border-b border-warm-border/70 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-basil-500/10">
              <ReceiptText size={20} className="text-basil-600" />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold text-espresso">Order summary</h2>

              <p className="break-all text-xs text-warm-gray">
                Reference: {order.orderId}
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-7">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {order.items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between gap-4 rounded-2xl bg-cream px-4 py-3"
              >
                <div className="min-w-0 text-sm text-espresso">
                  <span className="font-bold">{item.quantity} ×</span>{" "}
                  {item.name}
                </div>

                <span className="shrink-0 text-sm font-semibold text-espresso">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-dashed border-warm-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <div className="rounded-2xl bg-cream px-4 py-3">
                <p className="text-xs text-warm-gray">Payment</p>

                <p className="mt-1 text-sm font-bold capitalize text-espresso">
                  {order.paymentStatus}

                  {order.paymentStatus === "paid" && (
                    <span className="ml-1 text-xs font-normal text-muted">
                      (simulated)
                    </span>
                  )}
                </p>
              </div>

              <div className="rounded-2xl bg-cream px-4 py-3">
                <p className="text-xs text-warm-gray">Status</p>

                <p className="mt-1 text-sm font-bold text-espresso">
                  {formatStatus(order.status)}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Total paid
              </p>

              <p className="mt-1 text-2xl font-extrabold text-basil-600">
                {formatCurrency(order.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ACTION ==================== */}

      <div className="mt-6 flex flex-col items-center gap-3 pb-2 sm:flex-row sm:justify-between">
        <p className="text-center text-xs text-warm-gray sm:text-left">
          Handmade with tradition. Thank you for choosing Nanna's.
        </p>

        <Link
          to="/menu"
          className="inline-flex w-full items-center justify-center rounded-full bg-basil-500 px-7 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-basil-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-basil-600 sm:w-auto"
        >
          Back to the menu
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmation;

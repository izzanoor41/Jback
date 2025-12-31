"use client";

import { Button } from "@/components/ui/button";
import { Loader, XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Transition } from '@headlessui/react'
import toast from "react-hot-toast";
import clsx from "clsx";

export default function Page() {
  const params = useParams();
  const [rate, setRate] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState<any>();

  useEffect(() => {
    const getTeam = async () => {
      fetch(`/api/team/${params?.id}`)
        .then((res) => res.json())
        .then((res) => {
          setTeam(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getTeam();
  }, [params?.id]);

  const handleSendFeedback = async () => {
    if (rate == 0) {
      return toast.error("Rate your overall experience!");
    }

    if (description == "") {
      return toast.error("Add more details, please!");
    }

    setLoading(true);

    fetch("/api/feedback/collect", {
      method: "POST",
      body: JSON.stringify({
        rate: rate,
        text: description,
        teamId: params.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.success) {
          setRate(0);
          setDescription("");
          toast.success("Thanks for sharing your feedback!");
          setTimeout(() => {
            parent.postMessage("jback-minimized", "*");
          }, 1500);
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error("Failed to send feedback");
      });
  };

  return (
    <div className="bg-black/70 backdrop-blur-sm inset-0 fixed">
      <div className="absolute bottom-4 right-4 max-w-xs w-full bg-white rounded-xl">
        <div className="w-full rounded-xl p-4" style={{ backgroundColor: team?.style?.form_bg }}>
          <div className="flex items-start justify-between mb-3" style={{ color: team?.style?.form_color }}>
            <div>
              <h6 className="font-bold">{team?.style?.form_title}</h6>
              <p className="text-sm">{team?.style?.form_subtitle}</p>
            </div>
            <button
              onClick={() => parent.postMessage("jback-minimized", "*")}
              className="p-1 bg-white/50 rounded-full"
              style={{ color: team?.style?.form_bg }}
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white/90 rounded-lg p-3">
            <p className="text-sm mb-2">{team?.style?.form_rate_text}</p>
            <div className="grid grid-cols-5 gap-3">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  onClick={() => setRate(n)}
                  className={`w-full aspect-square shadow rounded-md border active:scale-95 transition-all hover:border-gray-300`}
                  style={{ background: rate === n ? team?.style?.form_bg : "white", color: rate === n ? team?.style?.form_color : "black" }}
                >
                  {n}
                </button>
              ))}
            </div>
            <Transition show={rate > 0} enter="transition-all duration-500" enterFrom="opacity-0 h-0" enterTo="opacity-100 h-full">
              <div className={clsx(['transition-all ease-in-out', 'data-[closed]:opacity-0', 'data-[enter]:duration-500', 'data-[leave]:duration-300'])}>
                <p className="text-sm mb-2 mt-3">{team?.style?.form_details_text}</p>
                <textarea
                  className="w-full rounded border p-3 placeholder:text-sm mb-2"
                  rows={6}
                  placeholder="Please let us know what's your feedback"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <Button
                  variant="brand"
                  className="w-full disabled:contrast-75 disabled:cursor-not-allowed"
                  onClick={handleSendFeedback}
                  disabled={loading}
                  style={{ background: team?.style?.form_bg, color: team?.style?.form_color }}
                >
                  {loading && <Loader className="w-4 h-4 animate-spin mr-1" />}
                  {team?.style?.form_button_text}
                </Button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  );
}

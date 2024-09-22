'use client';

import Image from 'next/image';

import { type Match } from '@/apis/matches';

interface MatchInfoProps {
  match: Match;
  matchName: string;
  isFixed: boolean;
}

export default function MatchInfo({ match, matchName, isFixed }: MatchInfoProps) {
  return (
    match && (
      <>
        <div>
          <div className="h-15 px-4 flex justify-between items-center bg-opacity-white-5 border-gold border-b">
            <div className="flex items-center gap-x-6">
              <p className="text-2xl font-bold text-gold">{matchName}</p>
              {match.wining_team_number !== null ? (
                <p className="flex items-center text-primary-100 gap-x-2">
                  <span className="font-thin text-xl">승리팀 선택 완료</span>
                  <Image
                    alt="check"
                    className="w-6 h-6"
                    height="24"
                    src="/icons/material-symbols-light_check.svg"
                    width="24"
                  />
                </p>
              ) : (
                <span className="text-xl text-opacity-white-80">승리팀을 선택해 주세요.</span>
              )}
            </div>
            <div className="flex items-center gap-x-[10px]">
              <button className="w-18 h-7.5 bg-opacity-white-10 text-lg text-opacity-white-80 rounded-full">
                수정
              </button>
              <button className="w-8 h-8 flex justify-center items-center bg-opacity-white-10 rounded-full">
                <Image
                  alt="close"
                  className="w-3 h-3"
                  height="12"
                  src="/icons/close.svg"
                  width="12"
                />
              </button>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-5 gap-6">
            {match.teams?.map((team, index) =>
              Object.values(team).map((member, memberIndex) =>
                match.wining_team_number === index ? (
                  <div
                    key={`${index}-${memberIndex}`}
                    className="h-20 flex flex-col justify-center items-center bg-gradient-primary-200 border border-primary-100 rounded gap-1"
                  >
                    <p className="text-primary-100 text-xl font-semibold">{member.name}</p>
                    <p className="text-primary-300">{member.nickname}</p>
                  </div>
                ) : (
                  <div
                    key={`${index}-${memberIndex}`}
                    className="h-20 flex flex-col justify-center items-center bg-opacity-white-5 border shadow-md rounded gap-1"
                  >
                    <p className="text-xl font-semibold">{member.name}</p>
                    <p className="text-opacity-white-80">{member.nickname}</p>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </>
    )
  );
}

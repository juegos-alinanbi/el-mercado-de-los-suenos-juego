"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { missionsMock } from "@/entities/mission/model/missions.mock";
import { productsMock } from "@/entities/product/model/products.mock";
import { paymentOptionsMock } from "@/entities/wallet/model/payment-options.mock";
import {
  createEmptyCartQuantities,
  sanitizeQuantity,
} from "@/features/market-game/domain/game-rules";

function createInitialState() {
  return {
    cartQuantities: createEmptyCartQuantities(productsMock),
    paidAmount: 0,
    paymentHistory: [],
    hasSubmittedPayment: false,
    sharingAnswer: 0,
  };
}

function createProgressState() {
  return {
    completedLevels: [],
    savedAmount: 0,
    rewardTokens: 0,
    rewardedLevels: [],
  };
}

export const useMarketGameStore = create(
  persist(
    (set) => ({
      levels: missionsMock,
      mission: missionsMock[0],
      products: productsMock,
      paymentOptions: paymentOptionsMock,
      soundEnabled: true,
      ...createProgressState(),
      ...createInitialState(),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      selectLevel: (levelId) =>
        set((state) => ({
          mission: state.levels.find((level) => level.id === levelId) ?? state.levels[0],
          ...createInitialState(),
        })),
      markLevelCompleted: (levelId) =>
        set((state) =>
          state.completedLevels.includes(levelId)
            ? {}
            : { completedLevels: [...state.completedLevels, levelId] },
        ),
      registerMissionReward: ({ levelId, savedAmount, rewardTokens }) =>
        set((state) =>
          state.rewardedLevels.includes(levelId)
            ? {}
            : {
                savedAmount: state.savedAmount + savedAmount,
                rewardTokens: state.rewardTokens + rewardTokens,
                rewardedLevels: [...state.rewardedLevels, levelId],
              },
        ),
      startMission: () => set((state) => ({ ...state, ...createInitialState() })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          cartQuantities: {
            ...state.cartQuantities,
            [productId]: sanitizeQuantity(quantity),
          },
          paidAmount: 0,
          paymentHistory: [],
          hasSubmittedPayment: false,
        })),
      incrementQuantity: (productId) =>
        set((state) => ({
          cartQuantities: {
            ...state.cartQuantities,
            [productId]: sanitizeQuantity((state.cartQuantities[productId] ?? 0) + 1),
          },
          paidAmount: 0,
          paymentHistory: [],
          hasSubmittedPayment: false,
        })),
      decrementQuantity: (productId) =>
        set((state) => ({
          cartQuantities: {
            ...state.cartQuantities,
            [productId]: sanitizeQuantity((state.cartQuantities[productId] ?? 0) - 1),
          },
          paidAmount: 0,
          paymentHistory: [],
          hasSubmittedPayment: false,
        })),
      clearCart: () =>
        set(() => ({
          cartQuantities: createEmptyCartQuantities(productsMock),
          paidAmount: 0,
          paymentHistory: [],
          hasSubmittedPayment: false,
        })),
      addPayment: (value) =>
        set((state) => ({
          paidAmount: state.paidAmount + value,
          paymentHistory: [...state.paymentHistory, value],
          hasSubmittedPayment: false,
        })),
      removeLastPayment: () =>
        set((state) => {
          const nextHistory = state.paymentHistory.slice(0, -1);
          const lastPayment = state.paymentHistory.at(-1) ?? 0;

          return {
            paidAmount: Math.max(0, state.paidAmount - lastPayment),
            paymentHistory: nextHistory,
            hasSubmittedPayment: false,
          };
        }),
      clearPayment: () =>
        set(() => ({
          paidAmount: 0,
          paymentHistory: [],
          hasSubmittedPayment: false,
        })),
      submitPayment: () => set(() => ({ hasSubmittedPayment: true })),
      setSharingAnswer: (value) => set(() => ({ sharingAnswer: Math.max(0, Math.floor(value)) })),
      incrementSharingAnswer: () => set((state) => ({ sharingAnswer: state.sharingAnswer + 1 })),
      decrementSharingAnswer: () => set((state) => ({ sharingAnswer: Math.max(0, state.sharingAnswer - 1) })),
      resetGame: () => set((state) => ({ soundEnabled: state.soundEnabled, ...createInitialState() })),
      restartAdventure: () =>
        set((state) => ({
          mission: state.levels[0],
          soundEnabled: state.soundEnabled,
          ...createProgressState(),
          ...createInitialState(),
        })),
    }),
    {
      name: "michi-money-progress",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        completedLevels: state.completedLevels,
        soundEnabled: state.soundEnabled,
        savedAmount: state.savedAmount,
        rewardTokens: state.rewardTokens,
        rewardedLevels: state.rewardedLevels,
      }),
    },
  ),
);

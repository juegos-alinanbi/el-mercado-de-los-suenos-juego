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

function shuffleProducts(products) {
  const shuffled = [...products];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createSharingBaskets(groupSize) {
  return Array.from({ length: groupSize ?? 3 }, () => 0);
}

function createInitialState(groupSize) {
  return {
    cartQuantities: createEmptyCartQuantities(productsMock),
    paidAmount: 0,
    paymentHistory: [],
    hasSubmittedPayment: false,
    sharingBaskets: createSharingBaskets(groupSize),
    sharingCheckResult: null,
    sharingAttempts: 0,
    sumAnswer: 0,
    sumCheckResult: null,
    sumAttempts: 0,
    changeAnswer: 0,
    changeCheckResult: null,
    changeAttempts: 0,
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
      productsShuffled: false,
      paymentOptions: paymentOptionsMock,
      soundEnabled: true,
      ...createProgressState(),
      ...createInitialState(missionsMock[0].sharing?.groupSize),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      shuffleProductsIfNeeded: () =>
        set((state) =>
          state.productsShuffled
            ? {}
            : { products: shuffleProducts(productsMock), productsShuffled: true },
        ),
      selectLevel: (levelId) =>
        set((state) => {
          const nextMission = state.levels.find((level) => level.id === levelId) ?? state.levels[0];
          return {
            mission: nextMission,
            products: shuffleProducts(productsMock),
            productsShuffled: true,
            ...createInitialState(nextMission.sharing?.groupSize),
          };
        }),
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
      startMission: () =>
        set((state) => ({
          ...state,
          products: shuffleProducts(productsMock),
          productsShuffled: true,
          ...createInitialState(state.mission.sharing?.groupSize),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          cartQuantities: {
            ...state.cartQuantities,
            [productId]: sanitizeQuantity(quantity),
          },
          paidAmount: 0,
          paymentHistory: [],
          hasSubmittedPayment: false,
          sumAnswer: 0,
          sumCheckResult: null,
          sumAttempts: 0,
          changeAnswer: 0,
          changeCheckResult: null,
          changeAttempts: 0,
          sharingBaskets: createSharingBaskets(state.mission.sharing?.groupSize),
          sharingCheckResult: null,
          sharingAttempts: 0,
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
          sumAnswer: 0,
          sumCheckResult: null,
          sumAttempts: 0,
          changeAnswer: 0,
          changeCheckResult: null,
          changeAttempts: 0,
          sharingBaskets: createSharingBaskets(state.mission.sharing?.groupSize),
          sharingCheckResult: null,
          sharingAttempts: 0,
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
          sumAnswer: 0,
          sumCheckResult: null,
          sumAttempts: 0,
          changeAnswer: 0,
          changeCheckResult: null,
          changeAttempts: 0,
          sharingBaskets: createSharingBaskets(state.mission.sharing?.groupSize),
          sharingCheckResult: null,
          sharingAttempts: 0,
        })),
      clearCart: () =>
        set((state) => ({
          cartQuantities: createEmptyCartQuantities(productsMock),
          paidAmount: 0,
          paymentHistory: [],
          hasSubmittedPayment: false,
          sumAnswer: 0,
          sumCheckResult: null,
          sumAttempts: 0,
          changeAnswer: 0,
          changeCheckResult: null,
          changeAttempts: 0,
          sharingBaskets: createSharingBaskets(state.mission.sharing?.groupSize),
          sharingCheckResult: null,
          sharingAttempts: 0,
        })),
      addPayment: (value) =>
        set((state) => ({
          paidAmount: state.paidAmount + value,
          paymentHistory: [...state.paymentHistory, value],
          hasSubmittedPayment: false,
          changeAnswer: 0,
          changeCheckResult: null,
          changeAttempts: 0,
        })),
      removeLastPayment: () =>
        set((state) => {
          const nextHistory = state.paymentHistory.slice(0, -1);
          const lastPayment = state.paymentHistory.at(-1) ?? 0;

          return {
            paidAmount: Math.max(0, state.paidAmount - lastPayment),
            paymentHistory: nextHistory,
            hasSubmittedPayment: false,
            changeAnswer: 0,
            changeCheckResult: null,
            changeAttempts: 0,
          };
        }),
      clearPayment: () =>
        set(() => ({
          paidAmount: 0,
          paymentHistory: [],
          hasSubmittedPayment: false,
          changeAnswer: 0,
          changeCheckResult: null,
          changeAttempts: 0,
        })),
      submitPayment: () => set(() => ({ hasSubmittedPayment: true })),
      incrementSharingBasket: (index, totalQuantity) =>
        set((state) => {
          const assigned = state.sharingBaskets.reduce((sum, value) => sum + value, 0);
          if (assigned >= totalQuantity) {
            return {};
          }
          const nextBaskets = [...state.sharingBaskets];
          nextBaskets[index] += 1;
          return { sharingBaskets: nextBaskets, sharingCheckResult: null };
        }),
      decrementSharingBasket: (index) =>
        set((state) => {
          if (state.sharingBaskets[index] <= 0) {
            return {};
          }
          const nextBaskets = [...state.sharingBaskets];
          nextBaskets[index] -= 1;
          return { sharingBaskets: nextBaskets, sharingCheckResult: null };
        }),
      checkSharingBaskets: (totalQuantity) =>
        set((state) => {
          const assigned = state.sharingBaskets.reduce((sum, value) => sum + value, 0);
          const allEqual = state.sharingBaskets.every((value) => value === state.sharingBaskets[0]);
          const isCorrect = assigned === totalQuantity && allEqual;
          return {
            sharingCheckResult: isCorrect ? "correct" : "incorrect",
            sharingAttempts: isCorrect ? state.sharingAttempts : state.sharingAttempts + 1,
          };
        }),
      setSumAnswer: (value) =>
        set(() => ({ sumAnswer: Math.max(0, Math.floor(value)), sumCheckResult: null })),
      incrementSumAnswer: () =>
        set((state) => ({ sumAnswer: state.sumAnswer + 1, sumCheckResult: null })),
      decrementSumAnswer: () =>
        set((state) => ({ sumAnswer: Math.max(0, state.sumAnswer - 1), sumCheckResult: null })),
      checkSumAnswer: (correctTotal) =>
        set((state) => {
          const isCorrect = state.sumAnswer === correctTotal;
          return {
            sumCheckResult: isCorrect ? "correct" : "incorrect",
            sumAttempts: isCorrect ? state.sumAttempts : state.sumAttempts + 1,
          };
        }),
      setChangeAnswer: (value) =>
        set(() => ({ changeAnswer: Math.max(0, Math.floor(value)), changeCheckResult: null })),
      incrementChangeAnswer: () =>
        set((state) => ({ changeAnswer: state.changeAnswer + 1, changeCheckResult: null })),
      decrementChangeAnswer: () =>
        set((state) => ({ changeAnswer: Math.max(0, state.changeAnswer - 1), changeCheckResult: null })),
      checkChangeAnswer: (correctChange) =>
        set((state) => {
          const isCorrect = state.changeAnswer === correctChange;
          return {
            changeCheckResult: isCorrect ? "correct" : "incorrect",
            changeAttempts: isCorrect ? state.changeAttempts : state.changeAttempts + 1,
          };
        }),
      resetGame: () =>
        set((state) => ({
          soundEnabled: state.soundEnabled,
          products: shuffleProducts(productsMock),
          productsShuffled: true,
          ...createInitialState(state.mission.sharing?.groupSize),
        })),
      restartAdventure: () =>
        set((state) => ({
          mission: state.levels[0],
          soundEnabled: state.soundEnabled,
          products: shuffleProducts(productsMock),
          productsShuffled: true,
          ...createProgressState(),
          ...createInitialState(state.levels[0].sharing?.groupSize),
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
